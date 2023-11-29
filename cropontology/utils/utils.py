from datetime import datetime as dt

import github
import pandas as pd

ORGANIZATION_NAME = 'Planteome'
BASE_BRANCH_NAME = 'master'


def get_csv_data(csv_path):
    df = pd.read_csv(csv_path)
    return df.to_csv(index=False)


def create_pull_request(repo, commit_message, new_branch_name):
    repo.create_pull(
        title=commit_message,
        base=BASE_BRANCH_NAME,
        body='Pull Request created through CropOntology Curation Tool',
        head=new_branch_name,
        draft=False)


def create_remote_branch(repo, new_branch_name, base_branch):
    try:
        repo.create_git_ref(
            ref=f"refs/heads/{new_branch_name}",
            sha=base_branch.commit.sha
        )
    except github.GithubException:
        pass


def update_github_file(csv_path, file_name, repo_name, github_token):
    github_api = github.Github(github_token)

    if not github_token:
        return

    try:
        repo = github_api.get_user(ORGANIZATION_NAME).get_repo(repo_name)
    except github.GithubException:
        print('Unknown repository')
        return

    commit_message = f'Updated by CropOntology Curation Tool: {dt.now().strftime("%d-%m-%Y")}'
    new_branch_name = f'updates_{dt.now().strftime("%d_%m_%Y")}'

    base_branch = repo.get_branch(BASE_BRANCH_NAME)
    create_remote_branch(repo, new_branch_name, base_branch)

    try:
        file = repo.get_contents(file_name)
    except github.GithubException:
        try:
            csv_data = get_csv_data(csv_path)
            repo.create_file(file_name, commit_message, csv_data, branch=new_branch_name)
            create_pull_request(repo, commit_message, new_branch_name)
        except github.GithubException:
            print('Cannot create new files')
            pass
        return

    csv_data = get_csv_data(csv_path)

    try:
        repo.update_file(file_name, commit_message, csv_data, file.sha, branch=new_branch_name)
        create_pull_request(repo, commit_message, new_branch_name)
    except github.GithubException:
        print('Cannot update files')
        pass
    return
