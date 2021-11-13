//Global variables
const overview = document.querySelector(".overview");/*Selects profile information*/
const username = "flo1244"; 
const repoList = document.querySelector(".repo-list");/*Selects the ul*/
const showInfo = document.querySelector(".repos");/*Selects where repo info appears*/
const showData = document.querySelector(".repo-data"); /*Selects where repo data appears*/
const backButton = document.querySelector(".view-repos");/*Selects Back to Repo Gallery button*/
const filterInput = document.querySelector(".filter-repos"); /*Selects the Search by name placeholder*/
const scrollDown = document.querySelector(".scroll-down");/*Selects the icon*/

//Scroll event
document.addEventListener("scroll", function(event){
		/*Scroll icon will display initially but upon scroll hides*/
		if("scroll" === true){
			scrollDown.classList.remove("hide");
			
		}else{
			scrollDown.classList.add("hide");
		}
	//console.log(scrollDown);
});

//API connecting to github repos
const getData = async function () {
	const res = await fetch(`https://api.github.com/users/${username}`);
	const data = await res.json();
	//console.log(data); 
	userInfo(data);/*Retrieves and displays the user info from github profile*/
};

getData(); /*calls the github api retrieving user specific data*/

//Fetch & display user info function
const userInfo = function (data) {
	const div = document.createElement("div");
	div.classList.add("user-info");
	
	div.innerHTML = `
	<figure>
      <img alt="user avatar" src=${data.avatar_url} />
    </figure>
    <div>
      <p><strong><i class="fad fa-code-branch"></i>&nbsp;&nbsp;Name:</strong> ${data.name}</p>
      <p><strong><i class="fad fa-code-branch"></i>&nbsp;&nbsp;Bio:</strong> ${data.bio}</p>
      <p><strong><i class="fad fa-code-branch"></i>&nbsp;&nbsp;Location:</strong> ${data.location}</p>
      <p><strong><i class="fad fa-code-branch"></i>&nbsp;&nbsp;Number of public repos:</strong> ${data.public_repos}</p>
	</div>`;
	overview.append(div);
	repoData(username);
};

//Fetch repos async function 
const repoData = async function (username) {
	const getRepos = await fetch(`https://api.github.com/users/${username}/repos?sort=update&per_page=100`);
	const showRepo = await getRepos.json();
	
	//console.log(showRepo);
	showRepos(showRepo);/*displays our repo on page*/
};

//Displays info about repos
const showRepos = function (repos) {
	filterInput.classList.remove("hide"); /*display input element*/
	for(const repo of repos){
		const list = document.createElement("li"); /*creates list item*/
		list.classList.add("repo");/*adds class repo to item*/
		list.innerHTML = `<h3>${repo.name}</h3>`;/*display repo name*/
		repoList.append(list);
	}
};

//Click event targets repo info
repoList.addEventListener("click", function (e){
	if(e.target.matches("h3")){
		const repoName = e.target.innerText;
		//console.log(repoName);
		getRepoInfo(repoName); /*Is triggered with click event --> click on repo name display repo info*/
	}
});

//Get specific repo info
const getRepoInfo = async function (repoName) {
	const fetchInfo = await fetch(`https://api.github.com/repos/${username}/${repoName}`); /*Allows for any repo to be selected*/
  	const repoInfo = await fetchInfo.json();
  	console.log(repoInfo);
	
	//Get code language
	const fetchLanguages = await fetch(repoInfo.languages_url);
	const languageData = await fetchLanguages.json();
	//console.log(languageData);
	
	//Make list of coding languages
	const languages = [];
	for(const language in languageData) {
		languages.push(language);
		//console.log(languages)
	}
  	
	displayRepoInfo(repoInfo, languages);/*Calls the display specific repo info function --> to see specific repo data displayed on page(description, langauage etc.)*/
};

//Display sepcific repo info
const displayRepoInfo = function (repoInfo, languages) {
	showData.innerHTML = "";
	showData.classList.remove("hide");
	showInfo.classList.add("hide");
	const newDiv = document.createElement("div");
	newDiv.innerHTML = `
	<h3>Name: ${repoInfo.name}</h3>
    	<p><i class="fad fa-brackets-curly"></i>&nbsp;Description: ${repoInfo.description}</p>
    	<p><i class="fad fa-code-merge"></i>&nbsp;&nbsp;&nbsp;Default Branch: ${repoInfo.default_branch}</p>
    	<p><i class="fad fa-code"></i>&nbsp;Languages: ${languages.join(", ")}</p>
    	<a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>`;
	showData.append(newDiv);
	backButton.classList.remove("hide");
	
};

//Click event to go back to repo gallery
backButton.addEventListener("click" , function(){
	showInfo.classList.remove("hide");
	showData.classList.add("hide");
	backButton.classList.add("hide");
});

//Creating dynamic search
filterInput.addEventListener("input", function(e){
	const search = e.target.value;
	//console.log(search);
	const repos = document.querySelectorAll(".repo");
	const searchSmallCase = search.toLowerCase();
	
	//Loops through repo and assign it a lowercase value of innerText
	for(const repo of repos){
		const repoSmallCase = repo.innerText.toLowerCase();
		if(repoSmallCase.includes(searchSmallCase)){
			repo.classList.remove("hide");
		}else{
			repo.classList.add("hide");
		}
	}
});


