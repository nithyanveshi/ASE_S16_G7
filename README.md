# Student Companion
Github repository for ASE Spring 16 project by Group 7.
This is an ionic hybrid application which can run on any platform. This application is targetted for the students who wants to check and update thier daily activities in the universities. Documentation for this application is provided in the Documentation directory of this repository.
<h4>Demo</h4>
<iframe width="420" height="315" src="https://www.youtube.com/embed/v6NcbSS8hcQ" frameborder="0" allowfullscreen></iframe>

#Prerequisites:
<ul>
  <li>node.js, npm</li>
  <li>ionic</li>
  <li>angularJS</li>
</ul>

#Plug-ins required:
<ul>
  <li>restify</li>
  <li>mongojs</li>
  <li>mongodb</li>
  <li>ionic-datepicker</li>
</ul>

#How to deploy the app:
<ol>
  <li>In your project folder, install the required plug-ins <br />
  <code>npm install restify</code> <br />
  <code>npm install mongojs</code> <br />
  <code>npm install mongodb</code> <br />
  <code>npm install ionic-datepicker</code> <br />
  </li>
  <li> Make sure that your ionic application module has loaded all the required dependencies. If not, inject the required dependencies.<br />
  <code>angular.module('starter', ['ionic', 'ionic-datepicker']) {
  //
  }</code>
  </li>
  <li>Configure your REST API  parameters in <code>services.js</code> file. <br />
  <code>var base = "<URL to REST API server>";</code><br />
  </li>
  <li>Configure your mongoDB connection parameters in <code>mServer.js</code>.<br />
  <code>var db = mongojs('mongodb://<userid>:<password>@<host>:<port>/<dbname>', ['Login', 'Address', 'Library', 'LibraryRooms', 'RoomReservation', 'SAShifts', 'Profile', 'Labs', 'Holidays', 'LibraryHours', 'Enrollments', 'Dues']);</code>
  </li>
  <li>Run the <code>mServer.js</code> using <code>node</code></li>
  <li>From application root folder, run <code>ionic serve</code> to run the application in browser</li>
</ol>
#Contact:
Gmail: meetsriharsha@gmail.com
