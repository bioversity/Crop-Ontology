import os
import uuid
from subprocess import Popen, PIPE
from bs4 import BeautifulSoup


def generate_diff(request, revision_id, file_a, file_b):
    repository_path = request.registry.settings.get("repository.path")
    paths = ["revision", revision_id, "diff"]
    revision_path = os.path.join(repository_path, *paths)
    if not os.path.exists(revision_path):
        os.makedirs(revision_path)

    diff_id = str(uuid.uuid4())
    temp_dir = os.path.join(
        repository_path, *["revision", revision_id, "diff", diff_id]
    )
    os.makedirs(temp_dir)
    diff_file = os.path.join(
        repository_path, *["revision", revision_id, "diff", diff_id, diff_id + ".diff"]
    )
    html_file = os.path.join(
        repository_path, *["revision", revision_id, "diff", diff_id, diff_id + ".html"]
    )

    args = ["diff", "-u", file_a, file_b]

    final = open(diff_file, "w")
    p = Popen(args, stdout=final, stderr=PIPE)
    nada, stderr = p.communicate()
    final.close()
    if p.returncode == 1:
        args = ["diff2html", "-s", "side", "-o", "stdout", "-i", "file", diff_file]

        final = open(html_file, "w")
        p = Popen(args, stdout=final, stderr=PIPE)
        nada, stderr = p.communicate()
        final.close()
        if p.returncode == 0:
            soup = BeautifulSoup(open(html_file), "html.parser")
            for diff in soup.find_all("div", {"class": "d2h-files-diff"}):
                return 0, diff
            return 0, ""
        else:
            message = (
                "Generating HTML "
                + html_file
                + ". Error: "
                + "-"
                + stderr.decode()
                + ". Command line: "
                + " ".join(args)
            )
            log.error(message)
            return 1, message
    else:
        if p.returncode != 0:
            message = (
                "DIFF Error. Comparing "
                + file_a
                + "  to "
                + file_b
                + ". Error: "
                + "-"
                + stderr.decode()
                + ". Command line: "
                + " ".join(args)
            )
            log.error(message)
            return 1, message
        else:
            return 1, "The files are the same"
