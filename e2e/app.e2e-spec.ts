import { AngularAotPage } from './app.po';

describe('angular-aot App', function() {
  let page: AngularAotPage;

  beforeEach(() => {
    page = new AngularAotPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
