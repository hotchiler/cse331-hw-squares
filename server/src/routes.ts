import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";

// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check
const transcripts: Map<string, unknown> = new Map<string, unknown>();

/**
 * Returns a greeting message if "name" is provided in query params.
 * @param req request to respond to.
 * @param res object to send response with.
 */
export const dummy = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.query.name);
  if (name === undefined) {
    res.status(400).send('missing "name" parameter');
    return;
  }

  res.send({ greeting: `Hi, ${name}` });
};

// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give multiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string | undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};

/**
 * Saves the name and value to the transcript.
 * @param req - The request object containing the name and value.
 * @param res - The response object to send the result.
 */
export const save = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  if (name === undefined || typeof name !== 'string') {
    res.status(400).send('required argument "name" was missing');
    return;
  }

  const content = req.body.content;
  if (content === undefined) {
    res.status(400).send('required argument "content" was missing');
    return;
  }

  const saved = transcripts.has(name);
  transcripts.set(name, content);
  res.send({ saved });
};

/**
 * Loads the content for a given name from the transcript.
 * @param req - The request object containing the name parameter.
 * @param res - The response object to send the result.
 * @returns - Sends the content if found, otherwise sends an error message.
 */
export const load = (req: SafeRequest, res: SafeResponse): void => {
  const result = first(req.query.name);
  if (result === undefined) {
    res.status(400).send('missing the required argument "name".');
    return;
  }

  if (transcripts.has(result)) {
    const content = transcripts.get(result);
    res.send({ name: result, content });
  } else {
    res.status(400).send(`missing the transcript "${result}".`);
  }
};

/**
 * Lists all names in the transcript.
 * @param req - The request object.
 * @param res - The response object to send the list of names.
 */
export const names = (_req: SafeRequest, res: SafeResponse): void => {
  res.send({ names: Array.from(transcripts.keys()) });
};

/**
 * Clears all transcripts from the map.
 */
export const resetTranscriptsForTesting = (): void => {
  transcripts.clear();
};
