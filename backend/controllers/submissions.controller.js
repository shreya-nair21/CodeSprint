import axios from 'axios';
import { Submission, Problem, User } from '../models.js';

//controller for submitting code
export const submitCode = async (req, res) => {
  try {
    const { problemId, code, languageId, runOnly } = req.body;
    const userId = req.user.id;

    if (!problemId || !code || !languageId) {
      return res.status(400).json({ message: 'Please provide problemId, code, and languageId' });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // Map Judge0 language IDs to JDoodle languages
    const jdoodleLanguages = {
      71: { language: 'python3', versionIndex: '3' },
      63: { language: 'nodejs', versionIndex: '4' },
      50: { language: 'c', versionIndex: '5' },
      54: { language: 'cpp', versionIndex: '5' },
      62: { language: 'java', versionIndex: '4' }
    };

    const runtime = jdoodleLanguages[languageId] || { language: 'python3', versionIndex: '3' };

    let allPassed = true;
    let totalTime = 0;
    let maxMemory = 0;
    let failedStatus = 'Accepted';
    let lastResult = null;

    // If runOnly is true, only run the first test case
    const testCases = runOnly ? [problem.testCases[0]] : problem.testCases;

    for (const testCase of testCases) {
      const options = {
        method: 'POST',
        url: 'https://api.jdoodle.com/v1/execute',
        headers: {
          'content-type': 'application/json'
        },
        data: {
          clientId: process.env.JDOODLE_CLIENT_ID,
          clientSecret: process.env.JDOODLE_CLIENT_SECRET,
          script: code,
          language: runtime.language,
          versionIndex: runtime.versionIndex,
          stdin: testCase.input
        },
        timeout: 10000
      };

      try {
        const response = await axios.request(options);
        const result = response.data;
        lastResult = result;

        if (result.error || result.statusCode === 429) {
          allPassed = false;
          failedStatus = result.error || 'JDoodle API Limit Reached';
          break;
        }

        const actualOutput = result.output ? result.output.trim() : '';
        if (actualOutput !== testCase.expectedOutput.trim()) {
          allPassed = false;
          failedStatus = 'Wrong Answer';
          break;
        }

        totalTime += parseFloat(result.cpuTime || 0);
        const memKb = parseFloat(result.memory || 0);
        const memMb = memKb / 1024;
        if (memMb > maxMemory) maxMemory = memMb;
      } catch (err) {
        if (err.response && err.response.status === 429) {
          return res.status(429).json({ 
            message: 'JDoodle Daily Limit Reached', 
            error: 'You have reached the daily limit of the free JDoodle API.' 
          });
        }
        throw err;
      }
    }

    if (runOnly) {
      return res.json({
        status: failedStatus,
        executionTime: totalTime,
        memory: Number(maxMemory.toFixed(2)),
        output: lastResult?.output,
        isRunOnly: true
      });
    }

    let points = 0;
    if (allPassed) {
      points = Math.max(10, 100 - Math.floor(totalTime * 10));
    }

    const submission = await Submission.create({
      userId,
      problemId,
      code,
      languageId,
      status: failedStatus,
      executionTime: allPassed ? totalTime : null,
      memory: allPassed ? Number(maxMemory.toFixed(2)) : null,
      points
    });

    res.status(201).json(submission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserSubmissions = async (req, res) => {
  try {
    const { problemId } = req.query;
    const query = { userId: req.user.id };
    if (problemId) query.problemId = problemId;

    const submissions = await Submission.find(query)
      .populate('problemId', 'title difficulty')
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
