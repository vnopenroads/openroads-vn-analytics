#!/usr/bin/env bash

set -eu

main() {
    [[ -f .env ]] && export $(cat .env | xargs)
    local env=$1
    [[ ${env} == "production" ]] && deploy_prod
    [[ ${env} == "uat" ]] && deploy_uat
}

deploy_uat() {
    for i in node-app cba-api react-app; do
        echo ./1.provision.sh --tags=${i}
    done
}

deploy_prod() {
    local ansible_cmd="ansible-playbook -i inventory playbook.yaml --extra-vars \"ansible_sudo_pass=${CBA_PASSWORD}\""
    ${ansible_cmd} --tags=cba-api -l orma-api
    # ${ansible_cmd} --tags=node-app
    # ${ansible_cmd} --tags=react-app
}

main "$@"