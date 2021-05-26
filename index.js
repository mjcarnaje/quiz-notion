const dotenv = require("dotenv").config();
const { Client } = require("@notionhq/client");
const express = require("express");
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
    return {
      id: question.id,
      question: question.properties.Questions.title[0].text.content,
      choices: question.properties.Choices.multi_select.map((choice) => ({
        id: choice.id,
        value: choice.name,
      })),
      answer: question.properties.Answer.rich_text[0].text.content,
    };
  });
  return questions;
};

const app = express();

app.use(express.static("public"));

app.get("/videos", async (req, res) => {
  const questions = await getQuestions();
  res.json(questions);
});

app.listen(PORT, console.log(`Server started on port ${PORT}`));
