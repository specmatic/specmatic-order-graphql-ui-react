// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { ReadableStream } from "node:stream/web";
import { MessagePort } from 'node:worker_threads';
Object.assign(global, { TextDecoder, TextEncoder, ReadableStream, MessagePort });
