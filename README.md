this project is a part of a blog http://www.talkinghightech.com/en/angular-2-aot-ahead-of-time/
# AngularAot
<h2 style="text-align: center;">AOT - ahead of time</h2>
&nbsp;

Are you ready to take your application to the extreme? If so then this post is your answer!

Angular 2 application is not a vanilla  javascript application which you can load into your browser and expect it to work with now helpers from the framework, In order to let the browser understand an Angular compiler needs to preform its magic, The components and templates will be translated to pure executable javascript, From the days of Angular 1 we would also load a javascript compiler that runs before our files are served to the browser engine and translates it to vanila Javascript, This mean we are carrying extra code we are not aware of and we are losing time duo to the compiler running before our application actually starts.

What if we could save some valuable space and time by compiling the templates before and serving to the browser the pre compiled code?
<h2 style="text-align: center;">Meet the AOT compiler</h2>
Actually its the same compiler as before but this time it runs during the build phase and not in the browser, Plus it will only run once as for in the browser it will run every time the application is loaded (f0r each user each time he refresh), The Angular 2 team promises us that using this method will give us a much more smaller application size and much more faster.
<h2 style="text-align: center;">Take a Walk through an Angular AOT Example</h2>
<p style="text-align: left;">For this demo in order to save some time I will use the Angular CLI, Let<code>s</code> start by creating a new project</p>

<pre>ng new angular_aot
</pre>
now that we have created a new angular 2 project go into the project and serve it :
<pre>cd angular_aot
ng serve // run the project
</pre>
Navigate to http://localhost:4200/ and you can see the app running, Now that it is set up and running we can start by installing the AOT compiler in the project:
<pre>npm install @angular/compiler-cli @angular/platform-server --save
</pre>
Now go to the src/app and create a tsconfig-aot.json file, Update it as the following:
<pre>{
  "compilerOptions": {
    "target": "es5",
    "module": "es2015",
    "moduleResolution": "node",
    "sourceMap": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "removeComments": false,
    "noImplicitAny": true,
    "suppressImplicitAnyIndexErrors": true
  },

  "files": [
    "app/app.module.ts",  // Our module entry point
    "main.ts"  // Our application entry point
  ],

  "angularCompilerOptions": {
    "genDir": "aot",  // Where to put the compiled files
    "skipMetadataEmit" : true 
  }
}
</pre>
Now run the compiler for the first time:
<pre>node_modules/.bin/ngc -p src/tsconfig-aot.json
</pre>
The gebDir will tell the compiler to store the compiled files under the aot directory,Now lets take a look of our main.ts that the CLI created:
<pre>import "./polyfills.ts";
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/';

if (environment.production) {
  enableProdMode();
}
platformBrowserDynamic().bootstrapModule(AppModule);
</pre>
Because the application is no longer compiled in the browser at runtime, we will need to alter our bootstrap method:
- platformBrowserDynamic.bootstrap - is the JIT compilation
- platformBrowser().bootstrapModuleFactory - AOT compilation
So we need to alter our main.ts code to:
<pre>import { platformBrowser }    from '@angular/platform-browser';
import { AppModuleNgFactory } from './aot/app/app.module.ngfactory';

platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
</pre>
We can notice that we are using ngFactory that lives in our newly created AOT folder, We have just changed out bootstrap app to the pre compiled version of our app, make sure you recompile the application.
<h2 style="text-align: center;">Get ready to Rollup.</h2>
<p style="text-align: left;">The Rollup will run our tree of dependencys and it will create a final code bundle with only the code that is actualy being used(Tree shaking).</p>
<p style="text-align: left;">You will need to install the rollup as the following :</p>

<pre>    npm install rollup rollup-plugin-node-resolve rollup-plugin-commonjs rollup-plugin-uglify --save-dev
</pre>
Before you will run the rollup run again the AOT compiler.
<pre>node_modules/.bin/ngc -p src/tsconfig-aot.json
</pre>
Create in your root direcotry the follwing file rollup-config.ts to tell the rollup how to run :
<pre>import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs    from 'rollup-plugin-commonjs';
import uglify      from 'rollup-plugin-uglify'

export default {
    entry: 'src/main.ts',
    dest: 'dist/build.js', // output a single application bundle
    sourceMap: false,
    format: 'iife',
    plugins: [
        nodeResolve({jsnext: true, module: true}),
        commonjs({
            include: 'node_modules/rxjs/**',
        }),
        uglify()
    ]
}
</pre>
We baiscly tell the rollup where is the entry file to our application and where to save the bundled file : dist/build.js
all we need to do know is tell our index.html file from where to load the bundled file :
<pre>  &lt; script src="dist/build.js"&gt;
</pre>
Now you can serve the application using the CLI :
<pre>ng serve
</pre>
YES!!! The application will boot from the bundled file, it will run much smaller and faster!

You can view the project and use it as a reference :
<a href="https://github.com/yonia1/angular_aot">https://github.com/yonia1/angular_aot</a>
References :

<a href="https://angular.io/docs/ts/latest/cookbook/aot-compiler.html">https://angular.io/docs/ts/latest/cookbook/aot-compiler.html</a>



## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Deploying to Github Pages

Run `ng github-pages:deploy` to deploy to Github Pages.

## Further help

To get more help on the `angular-cli` use `ng --help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
