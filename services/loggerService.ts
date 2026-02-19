
import { LoggerPayload } from '../types';
import { LOGGER_URL } from '../constants';

export const sendLog = async (payload: LoggerPayload): Promise<void> => {
  const body = JSON.stringify({ ...payload, timestamp: new Date().toISOString() });
  try {
    await fetch(LOGGER_URL, {
      method: "POST",
      mode: "no-cors",
      body: body
    });
  } catch (e) {
    console.error("Logger failed:", e);
  }
};
