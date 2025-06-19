declare global {
  interface Window {
    yaContextCb: Array<() => void>;
    Ya: {
      Context: {
        AdvManager: {
          render: (params: {
            blockId: string;
            type: string;
            platform: string;
          }) => void;
        };
      };
    };
  }
}

export const showAd = (): void => {
  if (!window.yaContextCb) {
    window.yaContextCb = [];
  }

  window.yaContextCb.push(() => {
    window.Ya.Context.AdvManager.render({
      blockId: "R-A-15949536-1", // замените на ваш blockId
      type: "fullscreen",
      platform: "desktop",
    });
  });
};
