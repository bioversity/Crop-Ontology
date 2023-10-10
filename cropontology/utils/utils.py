from datetime import datetime as dt

import github
import pandas as pd


def get_csv_data(csv_path):
    df = pd.read_csv(csv_path)
    return df.to_csv(index=False)


def update_github_file(csv_path, file_name, repo_name, github_token):
    github_api = github.Github(github_token)

    if not github_token:
        return

    try:
        repo = github_api.get_user().get_repo(repo_name)
    except github.GithubException:
        print('Unknown repository')
        return

    commit_message = f'Updated by CropOntology Curation Tool: {dt.now().strftime("%Y-%m-%d")}'

    try:
        file = repo.get_contents(file_name)
    except github.GithubException:
        try:
            csv_data = get_csv_data(csv_path)
            repo.create_file(file_name, commit_message, csv_data)
        except github.GithubException:
            pass
        return

    csv_data = get_csv_data(csv_path)
    repo.update_file(file_name, commit_message, csv_data, file.sha)

    return
