#!/bin/bash

declare -a contracts=( "DogeShit" "FakeDoge" "ERC20" "ShitLord" "ShitFountain" )

_dir="$(cd -P -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
_org="$(dirname "${_dir}")"
_build="${_org}/contracts/build"
_dest="${_dir}/src/contracts/"


mkdir -p "$_dest"

for contract in "${contracts[@]}"; do
	_abi="$(jq '.abi' "${_build}/contracts/${contract}.json")"
	_networks="$(jq '.networks' "${_build}/contracts/${contract}.json")"
	echo -e "export const ${contract}Artifact = {\n  'abi': ${_abi},\n  'networks':  ${_networks}\n};" > "${_dest}/${contract}.js"
	cp "${_build}/contracts/${contract}.json" "$_dest"
done
