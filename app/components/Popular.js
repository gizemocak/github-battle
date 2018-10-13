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
                props.fetchData();
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

  fetchData() {
    console.log();
    fetch(
      "https://api.github.com/search/repositories?q=stars:>1+language:" +
        this.state.selectedLanguage +
        "&sort=stars&order=desc&type=Repositories"
    )
      .then(response => response.json())
      .then(data => this.setState({ repos: data.items }))
      .catch(error => console.error("Error:", error));
  }

  updateLanguage(lang) {
    this.setState({ selectedLanguage: lang });
  }

  render() {
    return (
      <div>
        <SelectLanguage
          onClick={this.fetchData()}
          selectedLanguage={this.state.selectedLanguage}
          onSelect={lang => this.updateLanguage(lang)}
        />
      </div>
    );
  }
}
module.exports = Popular;
