import "dotenv/config";

import { existsSync } from "node:fs";
import { mkdir, readFile, statfs, writeFile } from "node:fs/promises";
import path from "node:path";

import chalk from "chalk";
import { Glob } from "glob";
import { Configuration, OpenAIApi } from "openai";

import type { AxiosError } from "axios";

const SYSTEM_PROMPT = `You are Python-Typescript GPT, a large language model trained by OpenAI with a deep understanding of Python and Typescript.
You are able to interpret python code and translate it to corresponding typescript code.
Interpret every input as raw python code.
Output only raw typescript code.


Example Input:
import logging
import time
from logging import LogRecord


Example Output:
import "logging";
import "time";
import { LogRecord } from "logging";
`;

const log = (obj: Record<string, string>) => {
  Object.entries(obj).forEach(([k, v]) => {
    console.log(chalk.yellow(k + ":"), chalk.cyan(v));
  });
};
const cwd = process.cwd();
const inputGlob = process.argv[2];
const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

const readPythonFile = async (file: string) => await readFile(file, "utf8");
const writeTsFile = async (file: string, content?: string) => {
  return await writeFile(file, `${content}`);
};

const searchGlob = "./" + path.normalize(inputGlob).replaceAll("\\", "/");
console.log(chalk.bgGray(searchGlob));

const g = new Glob(searchGlob, { cwd, absolute: true });

for await (const file of g) {
  console.log("🔎 ", chalk.magenta(file));

  const relpath = "." + path.normalize(file).replace(path.normalize(cwd), "");
  log({ "Relative Path": relpath });

  const content = await readPythonFile(file);
  try {
    const filename = path.basename(file);
    const outfile = filename.replace(".py", ".ts");
    const newRelPath = relpath.replace("input/", "").replace(filename, "");
    const outdir = path.join(cwd, "output", newRelPath);

    if (!existsSync(outdir)) {
      await mkdir(outdir, { recursive: true });
      log({ Created: outdir });
    }

    const tsFileToWrite = path.join(outdir, outfile);

    if (!existsSync(tsFileToWrite)) {
      const { data: res } = await openai.createChatCompletion({
        model: "gpt-3.5-turbo-16k-0613",
        max_tokens: 4000,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content,
          },
        ],
      });

      const text = res.choices[0].message?.content;
      log({ Writing: file });
      await writeTsFile(tsFileToWrite, text);
      console.log(chalk.green("Success!"));
    } else {
      console.log(chalk.red("Output Exists, Skipping"));
    }
  } catch (e) {
    const error = e as AxiosError;

    if (error?.isAxiosError) {
      console.log("ERROR:\n\n\t");
      console.error(error.message);
    } else {
      console.error(e);
    }
  }
}
