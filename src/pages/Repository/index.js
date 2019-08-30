import React, { Component } from 'react';
import api from '../../services/api';

// import { Container } from './styles';

export default class Repository extends Component {
  constructor(props) {
    super(props);

    this.state = {
      repository: {},
      issues: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.loadRepositorys();
  }

  loadRepositorys = async () => {
    const { match } = this.props;

    const repoName = decodeURIComponent(match.params.repository);

    // const response = await api.get(`repos/${repoName}`);
    // const issues = await api.get(`repos/${repoName}/issues`);

    // Chamar mais de uma requisição ao mesmo tempo
    const [repository, issues] = await Promise.all([
      api.get(`repos/${repoName}`),
      api.get(`repos/${repoName}/issues`, {
        params: {
          state: 'open',
          per_page: 5,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  };

  render() {
    const { repository, issues, loading } = this.state;
    return <h1>Repository</h1>;
  }
}
