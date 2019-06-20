# A Dashboard of Ice and Fire

### Milestone Project 2: Interactive Frontend Development


This is a single-page website that offers illustrated information on the HBO television series 'Game of Thrones.'

The page uses the D3.js library in conjunction with the DC.js and crossfilter.js libraries in order to display interconnected and dynamic graphs. The site contains the following types of graphs: bar charts, row charts, pie charts, and scatter plots.

In addition, the site uses jQuery to hide and display parts of the website. This gives the site a multi-page look despite being single page.

The current deployed version can be accessed at: https://synnea.github.io/GoT-Dashboard/.


## UX

The website's target audience are casual fans of the Game of Thrones TV series and it offers a condensed look at several key statistics on the series, split into three topics: general information, death statistics nd IMDB ratings. The unpredictability and brutality of the series' deaths are part of what made the show so popular, so the probablity is high that death-related statistics will be interesting to a large number of fans. Finally, a lot of people were unhappy with the final season of the show, and the IMDB rating section gives further information on the situation.

For aesthetic reasons, the website features a 'fake' multi-page layout. Upon visiting the website, the 'see the stats' button shivers into view. Intuitively, it becomes the first click of the user, leading to the dashboard.

The dashboard offers short cuts to different sections of the website in the form of buttons. The user will then be led to the relevant section via smooth scrolling.

For ease of navigation, the top section also contains a clickable arrow that transports the user to the beginning of the general information section, as well as a 'back to top' arrow at the bottom of the page.

### User Stories

The following user stories were used to design the website:

* I know nothing about the series Game of Thrones, but want to find out some basic information.
* I am a casual fan of the series, and want to learn more about it in a visually pleasing, easily digestible manner.
* I have not seen the series yet, but I am considering to watch it.
* As a casual fan disappointed in the series finale, I want to find out if my sentiment is shared among critics and other fans.

### Wireframes

Handdrawn wireframes were created to plan the project. The following wireframes date back to the beginning of the project.

![wireframe 1](https://github.com/synnea/GoT-Dashboard/blob/master/wireframes/wf1.jpg)
![wireframe 2](https://github.com/synnea/GoT-Dashboard/blob/master/wireframes/wf2.jpg)
![wireframe 3](https://github.com/synnea/GoT-Dashboard/blob/master/wireframes/wf3.jpg)
![wireframe 4](https://github.com/synnea/GoT-Dashboard/blob/master/wireframes/wf4.jpg)

A commented .pdf file is also available on [my Github repository](https://github.com/synnea/GoT-Dashboard/blob/master/wireframes/wf1-commented.pdf).

The finished project differs quite a bit from the wireframes. For one thing, the names of the links, which at inception stage still were named after series references were made more general and user-friendly. Also, the three dashboards were combined to one, but are still accessible separately via the shortcut buttons. Additionally, a 'redraw graphs' function was added to the navbar later, as it became clear that this was the most user-friendly way to reset graphs.

Additionally, a color palette was created early on, using the colors found in the background image as the basic point of reference. The palette was created using https://coolors.co/.

![colors](https://github.com/synnea/GoT-Dashboard/blob/master/wireframes/colorpalette1.png)


## Features

### Current Features

#### Feature 1 - jQuery hide function
Upon loading, jQuery hides the dashboard. Clicking on either the prominently places 'see the stats' button or clicking on the 'dashboard' link in the navbar unhides the link.

#### Feature 2 - CSS animations
The website features several CSS animations. The 'see the stats' button shivers into view using http://animista.net/. 

### Feature 3 - Smooth scrolling 
A smooth, animated scrolling feature was implemented using jQuery.

#### Feature 3 - Navigation Arrows
The navigation arrows in the dashboard were found on codepen and freefrontend. Sources can be found in the 'Credits' section of this Readme.md.

#### Feature 4 - Fixed navbar with redraw function
The navbar is fixed and offers a prominently placed redraw button, preceded by an intuitive icon. 

#### Feature 5 - Footer
A simple footer with a link to the original dataset on kaggle. Also contains a copyright notice and a link to my GitHub page.

#### Feature 6 - Graphs 
The heart of the website is, of course, the graphs. In total, the dashboard features 11 graphs of 4 different types, split into 3 categories. All graphs except for the scatterplot are interconnected, and selecting a specific season will give information on it throughout the entire dashboard. This interconnectivity was achieved using the crossfilter.js library in conjunction with DC.js.



### Features Left to Implement

#### Additional page with character information
Given the time, I would like to add an additional page with information on the characters appearing in the show.

#### Inclusion of an API
The books on which Game of Thrones are based have an [API](https://anapioficeandfire.com/). I would like to include the API in some form. At present, the project is only really relevant to show fans. The inclusion of the API and book information, though, would also make it interesting to readers.


## Technologies Used

### Programming Languages

 [HTML5](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)
    - The project uses **HTML5** to build the structure of the content.
    
 [CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS3)
    - The project uses **CSS3** to style the content.

 [JavaScript](https://developer.mozilla.org/de/docs/Web/JavaScript)
    - The project uses **JavaScript** for interactive elements as well as the graphs.    
    
### Framework
[Bootstrap](https://getbootstrap.com/)
    - The project uses **Bootstrap**, a CSS3 and JavaScript framework, to simplify and empower the CSS3.

#### Libraries

[D3.js, version 3.5.17](https://d3js.org/)
    - The project uses **D3.js**, a JavaScript library for manipulating documents, to bind data to the DOM.

[DC.js, version 2.1.8](https://dc-js.github.io/dc.js/)
    - The project uses **DC.js**, a JavaScript charting library, to create the graphs in the dashboard section.

[crossfilter.js, version 1.3.12](https://square.github.io/crossfilter/)
    - The project uses **crossfilter.js**, a JavaScript library, used to filter data and allow for easy interconnectivity.

[queue.js, version 1.0.7](https://github.com/d3/d3-queue)
    - The project uses **queue.js**, a JavaScript library, used to filter data and allow for easy interconnectivity.    



Cloud9 - This developer used Cloud9 for their IDE while building the website.
BootstrapCDN
The project uses Bootstrap4 to simplify the structure of the website and make the website responsive easily.
The project also uses BootstrapCDN to provide icons from FontAwesome
fancybox
The project uses Fancybox for a gallery modal popup to view gallery images.
Google Fonts
The project uses Google fonts to style the website fonts.
Vimeo
The project used Vimeo to host the promotional video.
jQuery
The project uses jQuery to reference Javascript needed for the responsive navbar, Vimeo video and Fancybox gallery modal.
Popper.js
The project uses Popper,js reference Javascript needed for the responsive navbar.
AutoPrefixer
This project used AutoPrefixer to make sure the css code is valid for all browsers.
All external images are stored and linked from a Wordpress Media library owned by the artist.


## Deployment
This project was developed locally using VS Code. A repository was created on github and named 'GoT-Dashboard.' Regular commits were made and pushed to my Github repository.

Very early on, I hosted the website on Github Pages. It was then regularly updated with my commits.

To initially deploy the project on Github Pages, the following steps were taken:

* Log into Github
* Select the repository synnea/GoT-Dashboard.
* Select the 'Settings' tab, which is the last tab in the top row.
* Use Cmd + F to open up a search window. Type in "GitHub Pages" and scroll automatically to the relevant section.
* Under Source, click the drop-down menu labelled None and select the master branch.
* Upon selecting the master branch, t the page refreshes automatically. The website is now deployed.
