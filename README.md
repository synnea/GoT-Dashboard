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

Handdrawn wireframes were created to plan the project:

![wireframe 1](https://github.com/synnea/GoT-Dashboard/blob/master/wireframes/wf1.jpg)

Features
Current Features
Feature 1 - Top title bar with Reset Filters button
The top bar contains the name of the site and also a button that when clicked, resets all the filters back to their default values.
The bar is fixed to the top of the page so even when the user scrolls down, the user can quickly and easily reset the filters at any point. This avoids the need for constant scrolling up and down the page.

Feature 2 - Footer
A simple footer with a link to the original dataset on kaggle. Also contains a copyright notice and a link to my GitHub page.

Feature 5 - Pie Charts
There are 4 pie charts, all displaying different data, they are - alignment, alter-ego, hair color, and eye color. As instructed in the introduction, the user can click on the individual pie slices to filter the data how they choose.
To avoid clutter and improve readability, the pie charts only shows the most common entries for hair and eye color. The ones that are not shown are grouped into their own section at the end, called others.
Feature 6 - Line Charts
There is 1 line chart, comprised of 6 different sources, each one relating to an attribute of the super-heroes. They are - Intelligence, Strength, Speed, Durability, Power, and Combat. This chart allows the user to see the spread of these attributes across the dataset. The user can hover over the data-point to see the exact values and can also hover over the legend to view just that attribute in isolation.
Feature 7 - Row & Bar Charts
The row chart is used to show the breakdown of heroes by their publisher. As with the other charts, the user can select 1 or more publishers to filter the rest of the data.
As with the hair and eye color pie charts, the row chart contains an 'other' section to group lots of individual publishers to avoid the list being too long and impacting readability.
There are 2 similar bar charts, for weight and height. Again, these are fully interactive, and the specific ranges can be selected to apply filters to the rest of the data.


Technologies Used
The dashboard relies:

HTML
For markup
CSS3
For dashboard styles and grid layout
SCSS
For splitting the stylesheets into partials for ease of development. My first time using SCSS and I do need to find a work flow that suits me.
Javascript
All three charting libraries are based on Javascript.
Bootstrap (version 4.3.1)
Used for all cards, font styles and modal.
D3.js (version 3.5.17)
JavaScript library for manipulating documents based on data and the backbone of the dashbaord.
Dc.js (version 2.1.8)
Leveraging d3.js to render charts in CSS-friendly SVG format.
Crossfilter.js (version 1.3.12)
A dependency of dc.js to provide linked filtering and aggregation of large datasets.
Queue.js (version 1.0.7)
Used to load in csv and geoJson data
Jquery (version 3.3.1)
For the welcome/info modal.
Font Awesome (version v5.7.2)
For number display icons and info icon.