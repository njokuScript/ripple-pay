import StartApp from './app/index';
console.ignoredYellowBox = ['Remote debugger']
let starter = new StartApp();
starter.makeRegistrations();
starter.startSingleApplication();
