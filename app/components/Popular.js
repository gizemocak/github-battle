var React = require("react");
var PropTypes = require("prop-types");

function SelectLanguage(props) {
  var languages = ["All", "JavaScript", "Ruby", "Java", "CSS", "Python"];
  return (
    <div>
      <ul className="languages">
        {languages.map(lang => {
          return (
            <li
              style={
                lang === props.selectedLanguage ? { color: "#d0021b" } : null
              }
              onClick={() => {
                props.onSelect(lang);
                props.onFetchData(lang);
              }}
              key={lang}
            >
              {lang}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function RepoGrid(props) {
  return (
    <ul className="popular-list">
      {props.repos.map((repo, index) => {
        return (
          <li key={repo.name} className="popular-item">
            <div className="popular-rank">#{index + 1}</div>
            <ul className="space-list-items">
              <li>
                <img
                  className="avatar"
                  src={repo.owner.avatar_url}
                  alt={"Avatar for" + repo.owner.login}
                />
              </li>
              <li>
                <a href={repo.html_url}>{repo.name}</a>
              </li>
              <li>@{repo.owner.login}</li>
              <li>{repo.stargazers_count} stars</li>
            </ul>
          </li>
        );
      })}
    </ul>
  );
}

RepoGrid.popTypes = {
  repos: PropTypes.array.isRequired
};

SelectLanguage.propTypes = {
  selectedLanguage: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
};

class Popular extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLanguage: "All",
      repos: null
    };
  }

  componentDidMount() {
    this.fetchData(this.state.selectedLanguage);
  }

  fetchData = (language = "All") => {
    const url = `https://api.github.com/search/repositories?q=stars:>1+language:
    ${language}
    &sort=stars&order=desc&type=Repositories`;
    fetch(url)
      .then(response => response.json())
      .then(data => this.setState({ repos: data.items }))
      .catch(error => console.error("Error:", error));
  };

  updateLanguage(lang) {
    this.setState({ selectedLanguage: lang });
  }

  render() {
    return (
      <div>
        <SelectLanguage
          onFetchData={this.fetchData}
          selectedLanguage={this.state.selectedLanguage}
          onSelect={lang => this.updateLanguage(lang)}
        />
        {!this.state.repos ? (
          <p>LOADING...</p>
        ) : (
          <RepoGrid repos={this.state.repos} />
        )}
      </div>
    );
  }
}
module.exports = Popular;
