interface FormatMessageProps {
  level: string;
  message: string;
  context?: string;
}

const formatMessage = ({ level, message, context }: FormatMessageProps) => {
  if (context) {
    return `[${level}](${context}) ${message}`;
  }

  return `[${level}] ${message}`;
};

const warn = (warning: string, context: string) => {
  console.log(formatMessage({ level: 'Warn', message: warning, context }));
};

const error = (message: string, context: string) => {
  console.log(formatMessage({ level: 'Error', message, context }));
};

const info = (info: string, context: string) => {
  console.log(formatMessage({ level: 'Info', message: info, context }));
};

const debug = (debug: string, context: string) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(
      new Date().toLocaleString('de-CH', { timeZone: 'Europe/Zurich' }),
      formatMessage({ level: 'Debug', message: debug, context }),
    );
  }
};

const captureException = (error: unknown, context?: string) => {
  if (error instanceof Error) {
    console.log(formatMessage({ level: 'Error', message: error.message, context }));
  }

  if (typeof error === 'string') {
    console.log(formatMessage({ level: 'Error', message: error, context }));
  }

  if (typeof error === 'object') {
    console.log(formatMessage({ level: 'Error', message: JSON.stringify(error), context }));
  }
};

const logger = {
  warn,
  error,
  info,
  debug,
  captureException,
};

export default logger;
