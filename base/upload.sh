#!/usr/bin/env bash
# 把生成好的文档上传到github.com/api上面去
# api-repos-location: /Users/leeight/local/leeight.github.com/edp-cli/api
# bash upload.sh localDocDir serverDocDir

set -x

API_REPOS_LOCATION="/Users/leeight/local/leeight.github.com/edp-cli/api"
LOCAL_DOC_DIR="$1"
SERVER_DOC_DIR="$2"

cd "${API_REPOS_LOCATION}"

mkdir -p $(dirname "$SERVER_DOC_DIR")
[ -e "${SERVER_DOC_DIR}" ] && git rm -r "${SERVER_DOC_DIR}"
mv "${LOCAL_DOC_DIR}" "${SERVER_DOC_DIR}"
git add .
git commit -a -m "Add ${SERVER_DOC_DIR} and auto commit"
git push origin gh-pages
