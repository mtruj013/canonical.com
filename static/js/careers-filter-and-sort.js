(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const domList = document.querySelector(".js-job-list");
  const filterSelect = document.querySelector(".js-filter");
  const tempFills = document.querySelectorAll(".js-filter");
  const noResults = document.querySelector(".js-filter__no-results");
  const jobContainer = document.querySelector(".js-filter-jobs-container");
  const sortSelect = document.querySelector(".js-sort");
  const locationSelect = document.querySelector(".js-filter--location");
  const tempLocationSelect = document.querySelectorAll(".js-filter--location");
  const searchBox = document.querySelector(".js-careers__search-input");
  
  // Show search and filter functionality if JS is available
  function revealSearch() {
    const searchForm = document.querySelector(".js-search-jobs-form");
    if (searchForm) {
      searchForm.classList.remove("u-hide");
    }
  }
  var numberOfJobsDisplayed = 0;
  var filterBy = {};

  // Read data-location property and parse locations into well-defined categories
  function parseLocations() {
    const regions = {
      europe: [
        "emea",
        "slovakia",
        "bratislava",
        "europe",
        "uk",
        "germany",
        "berlin",
        "london",
        "worldwide",
      ],
      americas: [
        "americas",
        "southwest",
        "san francisco",
        "usa",
        "austin",
        "texas",
        "tx",
        "brazil",
        "seattle",
        "america",
        "worldwide",
      ],
      asia: ["apac", "taiwan", "taipei", "beijing", "china", "worldwide"],
      "middle-east": ["emea", "worldwide"],
      africa: ["emea", "worldwide"],
      oceania: ["apac", "worldwide"],
    };

    const jobsList = document.querySelector(".js-job-list")?.children || [];
    for (let n = 0; n < jobsList.length; n++) {
      const location = jobsList[n].getAttribute("data-location");
      var locationsList = "";

      for (let region in regions) {
        const regionalLocations = regions[region];

        for (let i = 0; i < regionalLocations.length; i++) {
          if (location.toLowerCase().includes(regionalLocations[i])) {
            locationsList += region + " ";
            break;
          }
        }
      }

      if (locationsList.length > 0) {
        locationsList = locationsList.slice(0, locationsList.length - 1);
      }
      jobsList[n].setAttribute("location-filter", locationsList);
    }
  }

   // Update search box text with data from query params
   function populateTextbox() {
    const querySearchText = urlParams.get("search");
    if (searchBox && querySearchText) {
      searchBox.focus();
      searchBox.value = querySearchText;
    }
  }
  
  function init() {
    revealSearch();
    revealFilters();
    if (searchBox) {
      populateTextbox();
    }
    if (domList.length === 0) {
      updateNoResultsMessage();
    }
    if (domList) {
      // parseLocations();
      var rawJobList = domList.children;
      let jobList = rawJobList;
      if (rawJobList.childElementCount > 20){
        debugger;
        // jobList = jobList.slice(0,20);
        

        // domList.replaceChildren(jobList[0]);
      }
      

      let newOptions = [];
      tempFills.forEach(el => newOptions.push(el.name));

      if (tempFills) {
        // Get list of options from the HTML form
        var filterOptions = [];
        tempFills.forEach(el => filterOptions.push(el.name));
      
        let storedJobFilters = []
        tempFills.forEach(el => el.onclick = function(){tempListener(el, storedJobFilters)})


        if (urlParams.has("filter")) {
          // If the page is loaded with inital URL parameters, change the default form selection and filter the results to reflect this
          var filterValue = urlParams.get("filter");
          for (let n = 0; n < filterOptions.length; n++) {
            if (filterOptions[n] === filterValue) {
              filterSelect.options.selectedIndex = n;
              break;
            }
          }
        }
        
        // Add event listener that will update the URL and filter the results if the selected option is changed
        function tempListener(el, storedJobFilters) {
          // if the checkbox is checked, add the dept to list of filters, if it is unchecked do the opposite
          if (el.checked){
            storedJobFilters.push(el.name)
            
            updateURL(el.name, storedJobFilters);
            // updateNoResultsMessage();
          } else {
            let index = storedJobFilters.indexOf(el.name)
            if (index > -1) {
              storedJobFilters.splice(index, 1)
            }             
          }
          tempFilterJobs(storedJobFilters, jobList);
          
        }
      }

      if (tempLocationSelect) {
        // store clicked fitlers
        let storedLocationFilters = []
        tempLocationSelect.forEach(el => el.onclick = function(){locationListener(el, storedLocationFilters)})
        
        console.log("from location", storedLocationFilters)
        // Get list of options from the HTML form
        var locationOptions = [];
        tempLocationSelect.forEach(el => locationOptions.push(el.name));
        // Array.from(locationSelect.options).forEach(function (el) {
        //   locationOptions.push(el.value);
        // });

        if (urlParams.has("location")) {
          // If the page is loaded with inital URL parameters, change the default form selection and filter the results to reflect this
          var locationValue = urlParams.get("location");
          for (var n = 0; n < locationOptions.length; n++) {
            if (locationOptions[n] === locationValue) {
              locationSelect.options.selectedIndex = n;
              break;
            }
          }
        }

        // updateLocationFilterBy(
        //   locationSelect.options[locationSelect.options.selectedIndex].value
        // );

        // Add event listener that will update the URL and filter the results if the selected option is changed
        locationSelect.addEventListener("change", function () {
          if (!(sortSelect.options.selectedIndex === 0)) {
            sortSelect.options.selectedIndex = 0;
          }
          updateLocationFilterBy(
            locationSelect.options[locationSelect.options.selectedIndex].value
          );
          filterJobs(filterBy, jobList);
          updateURL(filterBy);
          updateNoResultsMessage();
        });
      }

      tempFilterJobs(filterBy, jobList);
      updateNoResultsMessage();

    }
  }

  function pagination(){

  }

  // Show filters if JS is available
  function revealFilters() {
    var filterForm = document.querySelector(".js-filter-form");
    if (filterForm) {
      filterForm.classList.remove("u-hide");
    }
  }

  function tempFilterJobs(filterList, jobList){
    numberOfJobsDisplayed = domList.childElementCount;
    console.log(filterList)
    
    jobList.forEach(function (node) {
      let jobSector = node.dataset.sector;
      
      if (filterList.length === 0){
        if (node.classList.contains("u-hide")) {
          node.classList.remove("u-hide");
        } 
      } else {
        //filter by dept
        if (filterList.includes(jobSector)){
          console.log(jobSector)
          // if it was previously hidden, unhide it
          if (node.classList.contains("u-hide")) {
            node.classList.remove("u-hide");
          } 
        } else {
          if (!node.classList.contains("u-hide")) {
            node.classList.add("u-hide");
          }
          numberOfJobsDisplayed--;
        }
      } 

      

      //filter by location

      //filter by both
    })

    console.log(numberOfJobsDisplayed)
  }

  function filterJobs(filterBy, jobList) {
    numberOfJobsDisplayed = domList.childElementCount;
    // jobList.forEach(job => checkFilters(job, filterBy))
    
    
    jobList.forEach(function (node) {
      console.log(node.dataset.sector, filterBy)

      // if there are no location or department filters
      if (filterBy.filterText === "All" && filterBy.location === "all") {
        if (node.classList.contains("u-hide")) {
          node.classList.remove("u-hide");
        }
        numberOfJobsDisplayed = domList.childElementCount;
      } 
      
      // if there are no location filters, but there are department filters
      else if (
        filterBy.filterValue !== "all" &&
        filterBy.location === "all"
      ) {
        if (node.dataset.sector == filterBy.filterText) {
          if (node.classList.contains("u-hide")) {
            node.classList.remove("u-hide");
          }
        } else {
          if (!node.classList.contains("u-hide")) {
            node.classList.add("u-hide");
          }
          numberOfJobsDisplayed--;
        }
      } else if (
        filterBy.filterValue === "all" &&
        filterBy.location !== "all"
      ) {
        if (node.getAttribute("location-filter").includes(filterBy.location)) {
          if (node.classList.contains("u-hide")) {
            node.classList.remove("u-hide");
          }
        } else {
          if (!node.classList.contains("u-hide")) {
            node.classList.add("u-hide");
          }
          numberOfJobsDisplayed--;
        }
      } else {
        if (
          node.dataset.sector == filterBy.filterText &&
          node.getAttribute("location-filter").includes(filterBy.location)
        ) {
          if (node.classList.contains("u-hide")) {
            node.classList.remove("u-hide");
          }
        } else {
          if (!node.classList.contains("u-hide")) {
            node.classList.add("u-hide");
          }
          numberOfJobsDisplayed--;
        }
      }
    });
  }


  function updateLocationFilterBy(location) {
    switch (location) {
      case "europe":
        filterBy.location = "europe";
        break;
      case "americas":
        filterBy.location = "americas";
        break;
      case "asia":
        filterBy.location = "asia";
        break;
      case "middle-east":
        filterBy.location = "middle-east";
        break;
      case "africa":
        filterBy.location = "africa";
        break;
      case "oceania":
        filterBy.location = "oceania";
        break;
      default:
        filterBy.location = "all";
    }
  }

  // Display no reults message
  function updateNoResultsMessage() {
    if (noResults && jobContainer) {
      if (numberOfJobsDisplayed === 0) {
        noResults.classList.remove("u-hide");
        jobContainer.classList.add("u-hide");
      } else {
        noResults.classList.add("u-hide");
        jobContainer.classList.remove("u-hide");
      }
    }
  }

  function updateURL(filterBy, filters) {
    // console.log(filters)
    var baseURL = window.location.origin + window.location.pathname;
    // console.log(filterBy)
    for (let i = 0; i < filters.length; i++){
      console.log("from loop",filters[i], baseURL)
      if (baseURL.includes(filters[i])){
        console.log("it does")
      } else {
        urlParams.append("filter", filters[i])
      }
    }
    // filters.forEach(filter => baseUrl.includes(filter ) ? console.log("made it here") : urlParams.append("filter", filter))
    // urlParams.set("filter", filterBy);
    urlParams.set("location", filterBy.location);

    var url = baseURL + "?" + urlParams.toString();
    console.log(url)
    window.history.pushState({}, "", url);
  }
    window.addEventListener('DOMContentLoaded', (event) => {
      init();
    })
  })();
