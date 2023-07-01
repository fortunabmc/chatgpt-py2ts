import "dotenv/config";

import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const { data: response } = await openai.listModels();

const models = response.data.map(m => m.id);

models.sort();

console.log(models);
