/** @param {NS} ns **/

let scripts = ['/js/openPorts.js']

export async function main(ns) {
	let portOpeners = {
		0: ns.nuke
		, 1: ns.brutessh
		, 2: ns.ftpcrack
		, 3: ns.relaysmtp
	}

	let servers = await ns.scan()

	for (let serv of servers) {
		if (!serv.startsWith('pserv')) {
			let hasRoot = checkRootAccess(ns, serv, portOpeners);
			if (hasRoot) {
				await ns.sleep(1000);
				await copyExecute(ns, serv);
			}
		}
	}
}

const checkRootAccess = (ns, serverName, progs) => {
	if (!ns.hasRootAccess(serverName)) {
		if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(serverName)) {
			let portReq = ns.getServerNumPortsRequired(serverName);
			for (let num = 1; num <= portReq; num++) {
				progs[num](serverName);

			}
			progs[0](serverName);
		}

		return ns.hasRootAccess(serverName);
	}
	else {
		return true
	}
}

const copyExecute = async (ns, serverName) => {
	await ns.scp(scripts, ns.getHostname(), serverName);
	ns.exec(scripts[0], serverName)
}