var React = require("react");

var id = "e30209c8968569ed35d7";
var sec = "4d33c7633f077a482eb324a6379daf32aa910561";
var params = "?client_id=" + id + "&client_secret=" + sec;

function getProfile(username) {
  return fetch("https://api.github.com/users/" + username + params)
    .then(response => response.json())
    .catch(error => console.error("Error in getProfile funct fetch:", error));
}

function getRepos(username) {
  return fetch(
    "https://api.github.com/users/" +
      username +
      "/repos" +
      params +
      "&per_page=100"
  )
    .then(response => response.json())
    .catch(error => console.error("Error in getRepos funct fetch:", error));
}

function getStarCount(repos) {
  return repos.reduce((count, repo) => count + repo.stargazers_count, 0);
}

function calculateScore(profile, repos) {
  let followers = profile.followers;
  let totalStars = getStarCount(repos);
  return followers * 3 + totalStars;
}

function handleError(error) {
  console.warn(error);
  return null;
}

function getUserData(player) {
  return Promise.all([getProfile(player), getRepos(player)]).then(data => {
    let profile = data[0];
    let repos = data[1];

    return {
      profile: profile,
      score: calculateScore(profile, repos)
    };
  });
}

function sortPlayers(players) {
  return players.sort((a, b) => b.score - a.score);
}

module.exports = {
  battle: function(players) {
    return Promise.all(players.map(getUserData))
      .then(data => {
        return sortPlayers(data);
      })
      .catch(handleError);
  }
};
