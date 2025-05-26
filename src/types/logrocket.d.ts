declare module 'logrocket' {
  interface LogRocketConfig {
    release?: string;
    console?: {
      isEnabled?: boolean;
      shouldAggregateConsoleErrors?: boolean;
    };
    network?: {
      requestSanitizer?: (request: any) => any;
    };
  }

  const LogRocket: {
    init: (appId: string, config?: LogRocketConfig) => void;
    [key: string]: any;
  };

  export default LogRocket;
}

declare module 'logrocket-react' {
  const setupLogRocketReact: (logRocket: any) => void;
  export default setupLogRocketReact;
}
