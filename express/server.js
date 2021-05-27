const dotenv = require("dotenv").config();
const { Client } = require("@notionhq/client");
const express = require("express");
const serverless = require("serverless-http");

const PORT = process.env.PORT | 4000;

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const getQuestions = async () => {
  const { results } = await notion.request({
    path: `databases/${process.env.NOTION_DATABASE_ID}/query`,
    method: "POST",
  });

  const questions = results.map((question) => {
    const answer = question.properties.Answer.rich_text[0].text.content;

    return {
      id: question.id,
      question: question.properties.Questions.title[0].text.content,
      choices: question.properties.Choices.multi_select.map((choice) => ({
        id: choice.id,
        value: choice.name,
      })),
      answer: {
        value: answer,
        id: question.properties.Choices.multi_select.filter(
          (x) => x.name === answer
        )[0].id,
      },
    };
  });
  return questions;
};

const app = express();

const router = express.Router();

app.use(express.static("public"));
router.get("/questions", async (req, res) => {
  const questions = await getQuestions();
  res.json(questions);
});
app.use(bodyParser.json());
app.use("/.netlify/functions/server", router);

module.exports = app;
module.exports.handler = serverless(app);
