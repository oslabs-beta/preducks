import { Application } from 'spectron';
import { join } from 'path';

const baseDir = join(__dirname, '..');
const electronPath = join(baseDir, 'node_modules', '.bin', 'electron');
let app;

describe('Application launch', () => {
  beforeEach(() => {
    app = new Application({
      path: electronPath,
      args: [baseDir],
    });
    return app.start();
  });

  afterEach(async () => {
    // console.log(app);
    if (app && app.running) {
      return app.stop();
    }
    const hi = await app.stop();
    return hi;
  });

  it('shows an initial window', async () => {
    const count = await app.client.getWindowCount();
    expect(count).toEqual(1);
  });

  // it('shows an initial window', async () => {
  //   const title = app.client.browserWindow.getTitle();
  //   expect(title).toEqual('preducks');
  // });

  it('shows an initial window', async () => {
    await app.client.waitUntilWindowLoaded();
    const appHTML = await app.client.getHTML('#app');
    // console.log(appHTML);
    // const appElement = await app.client.isExisting('.MuiModal-root-524');
    // console.log(appElement);
    // console.log(appElement.getCSSProperty('aria-hidden'));
    // expect(app.client.$('#app').getCSSProperty('aria-hidden')).toEqual('true');
  });
});
