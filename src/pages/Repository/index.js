import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../services/api';

import Container from '../../components/Container';
import { Loading, Owner, IssuesList } from './styles';

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

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

    if (loading) {
      return <Loading>Carregando</Loading>;
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        <IssuesList>
          {issues.map(item => (
            <li key={String(item.id)}>
              <img src={item.user.avatar_url} alt={item.user.login} />
              <div>
                <strong>
                  <a href={item.html_url}>{item.title}</a>
                  {item.labels.map(i => (
                    <span key={String(i.id)}>{i.name}</span>
                  ))}
                </strong>
                <p>{item.user.login}</p>
              </div>
            </li>
          ))}
        </IssuesList>
      </Container>
    );
  }
}
