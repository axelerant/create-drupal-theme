declare interface DrupalInterace {
  behaviors: {
    [key: string]: {
      attach: (
        settings?: { [key: string]: unknown },
        context?: HTMLElement,
      ) => void;
    };
  };
}

declare const Drupal: DrupalInterace;
