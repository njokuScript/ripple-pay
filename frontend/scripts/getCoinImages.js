const Promise = require('bluebird');
const download = require('image-downloader');

const shapeshift = {
    "BTC": {
    "name": "Bitcoin",
    "symbol": "BTC",
    "image": "https://shapeshift.io/images/coins/bitcoin.png",
    "imageSmall": "https://shapeshift.io/images/coins-sm/bitcoin.png",
    "status": "available"
    },
    "1ST": {
    "name": "FirstBlood",
    "symbol": "1ST",
    "image": "https://shapeshift.io/images/coins/firstblood.png",
    "imageSmall": "https://shapeshift.io/images/coins-sm/firstblood.png",
    "status": "available"
    },
    "ANT": {
        "name": "Aragon",
            "symbol": "ANT",
                "image": "https://shapeshift.io/images/coins/aragon.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/aragon.png",
                        "status": "available"
    },
    "BAT": {
        "name": "Basic Attention Token",
            "symbol": "BAT",
                "image": "https://shapeshift.io/images/coins/basicattentiontoken.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/basicattentiontoken.png",
                        "status": "available"
    },
    "BNT": {
        "name": "Bancor",
            "symbol": "BNT",
                "image": "https://shapeshift.io/images/coins/bancor.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/bancor.png",
                        "status": "available"
    },
    "BCH": {
        "name": "Bitcoin Cash",
            "symbol": "BCH",
                "image": "https://shapeshift.io/images/coins/bitcoincash.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/bitcoincash.png",
                        "status": "available"
    },
    "BTG": {
        "name": "Bitcoin Gold",
            "symbol": "BTG",
                "image": "https://shapeshift.io/images/coins/bitcoingold.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/bitcoingold.png",
                        "status": "available"
    },
    "BCY": {
        "name": "BitCrystals",
            "symbol": "BCY",
                "image": "https://shapeshift.io/images/coins/bitcrystals.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/bitcrystals.png",
                        "status": "unavailable"
    },
    "BLK": {
        "name": "Blackcoin",
            "symbol": "BLK",
                "image": "https://shapeshift.io/images/coins/blackcoin.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/blackcoin.png",
                        "status": "available"
    },
    "BTCD": {
        "name": "BitcoinDark",
            "symbol": "BTCD",
                "image": "https://shapeshift.io/images/coins/bitcoindark.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/bitcoindark.png",
                        "status": "unavailable"
    },
    "BTS": {
        "name": "Bitshares",
            "symbol": "BTS",
                "specialReturn": false,
                    "specialOutgoing": true,
                        "specialIncoming": true,
                            "fieldName": "destTag",
                                "fieldKey": "destTag",
                                    "image": "https://shapeshift.io/images/coins/bitshares.png",
                                        "imageSmall": "https://shapeshift.io/images/coins-sm/bitshares.png",
                                            "status": "unavailable"
    },
    "CVC": {
        "name": "Civic",
            "symbol": "CVC",
                "image": "https://shapeshift.io/images/coins/civic.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/civic.png",
                        "status": "available"
    },
    "CLAM": {
        "name": "Clams",
            "symbol": "CLAM",
                "image": "https://shapeshift.io/images/coins/clams.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/clams.png",
                        "status": "available"
    },
    "DASH": {
        "name": "Dash",
            "symbol": "DASH",
                "image": "https://shapeshift.io/images/coins/dash.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/dash.png",
                        "status": "available"
    },
    "DCR": {
        "name": "Decred",
            "symbol": "DCR",
                "image": "https://shapeshift.io/images/coins/decred.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/decred.png",
                        "status": "available"
    },
    "DGB": {
        "name": "Digibyte",
            "symbol": "DGB",
                "image": "https://shapeshift.io/images/coins/digibyte.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/digibyte.png",
                        "status": "available"
    },
    "DNT": {
        "name": "district0x",
            "symbol": "DNT",
                "image": "https://shapeshift.io/images/coins/district0x.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/district0x.png",
                        "status": "available"
    },
    "DOGE": {
        "name": "Dogecoin",
            "symbol": "DOGE",
                "image": "https://shapeshift.io/images/coins/dogecoin.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/dogecoin.png",
                        "status": "available"
    },
    "EMC": {
        "name": "Emercoin",
            "symbol": "EMC",
                "image": "https://shapeshift.io/images/coins/emercoin.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/emercoin.png",
                        "status": "unavailable"
    },
    "EDG": {
        "name": "Edgeless",
            "symbol": "EDG",
                "image": "https://shapeshift.io/images/coins/edgeless.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/edgeless.png",
                        "status": "available"
    },
    "EOS": {
        "name": "EOS",
            "symbol": "EOS",
                "image": "https://shapeshift.io/images/coins/eos.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/eos.jpeg",
                        "status": "available"
    },
    "ETH": {
        "name": "Ether",
            "symbol": "ETH",
                "image": "https://shapeshift.io/images/coins/ether.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/ether.png",
                        "status": "available"
    },
    "ETC": {
        "name": "Ether Classic",
            "symbol": "ETC",
                "image": "https://shapeshift.io/images/coins/etherclassic.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/etherclassic.png",
                        "status": "available"
    },
    "FCT": {
        "name": "Factoids",
            "symbol": "FCT",
                "image": "https://shapeshift.io/images/coins/factoids.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/factoids.png",
                        "status": "available"
    },
    "FUN": {
        "name": "FunFair",
            "symbol": "FUN",
                "image": "https://shapeshift.io/images/coins/funfair.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/funfair.png",
                        "status": "available"
    },
    "GAME": {
        "name": "GameCredits",
            "symbol": "GAME",
                "image": "https://shapeshift.io/images/coins/game.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/game.png",
                        "status": "available"
    },
    "GNO": {
        "name": "Gnosis",
            "symbol": "GNO",
                "image": "https://shapeshift.io/images/coins/gnosis.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/gnosis.png",
                        "status": "available"
    },
    "GNT": {
        "name": "Golem",
            "symbol": "GNT",
                "image": "https://shapeshift.io/images/coins/golem.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/golem.png",
                        "status": "available"
    },
    "GUP": {
        "name": "Matchpool",
            "symbol": "GUP",
                "image": "https://shapeshift.io/images/coins/matchpool.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/matchpool.png",
                        "status": "available"
    },
    "KMD": {
        "name": "Komodo",
            "symbol": "KMD",
                "image": "https://shapeshift.io/images/coins/komodo.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/komodo.png",
                        "status": "available"
    },
    "LBC": {
        "name": "LBRY Credits",
            "symbol": "LBC",
                "image": "https://shapeshift.io/images/coins/lbry.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/lbry.png",
                        "status": "available"
    },
    "LSK": {
        "name": "Lisk",
            "symbol": "LSK",
                "image": "https://shapeshift.io/images/coins/lisk.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/lisk.png",
                        "status": "unavailable"
    },
    "LTC": {
        "name": "Litecoin",
            "symbol": "LTC",
                "image": "https://shapeshift.io/images/coins/litecoin.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/litecoin.png",
                        "status": "available"
    },
    "MAID": {
        "name": "Maidsafe",
            "symbol": "MAID",
                "image": "https://shapeshift.io/images/coins/maidsafe.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/maidsafe.png",
                        "status": "unavailable"
    },
    "MLN": {
    "name": "Melon",
    "symbol": "MLN",
    "image": "https://shapeshift.io/images/coins/melon.png",
    "imageSmall": "https://shapeshift.io/images/coins-sm/melon.png",
    "status": "unavailable"
    },
    "MTL": {
        "name": "Metal",
            "symbol": "MTL",
                "image": "https://shapeshift.io/images/coins/metal.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/metal.png",
                        "status": "unavailable"
    },
    "MONA": {
        "name": "Monacoin",
            "symbol": "MONA",
                "image": "https://shapeshift.io/images/coins/monacoin.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/monacoin.png",
                        "status": "unavailable"
    },
    "MSC": {
        "name": "Omni",
            "symbol": "MSC",
                "image": "https://shapeshift.io/images/coins/mastercoin.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/mastercoin.png",
                        "status": "unavailable"
    },
    "NEO": {
        "name": "Neo",
            "symbol": "NEO",
                "image": "https://shapeshift.io/images/coins/neo.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/neo.png",
                        "status": "unavailable"
    },
    "NBT": {
        "name": "Nubits",
            "symbol": "NBT",
                "image": "https://shapeshift.io/images/coins/nubits.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/nubits.png",
                        "status": "unavailable"
    },
    "NMC": {
        "name": "Namecoin",
            "symbol": "NMC",
                "image": "https://shapeshift.io/images/coins/namecoin.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/namecoin.png",
                        "status": "unavailable"
    },
    "XEM": {
        "name": "NEM",
            "symbol": "XEM",
                "specialReturn": false,
                    "specialOutgoing": true,
                        "specialIncoming": false,
                            "fieldName": "Message",
                                "fieldKey": "destTag",
                                    "image": "https://shapeshift.io/images/coins/nem.png",
                                        "imageSmall": "https://shapeshift.io/images/coins-sm/nem.png",
                                            "status": "unavailable"
    },
    "NMR": {
        "name": "Numeraire",
            "symbol": "NMR",
                "image": "https://shapeshift.io/images/coins/numeraire.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/numeraire.png",
                        "status": "available"
    },
    "NVC": {
        "name": "Novacoin",
            "symbol": "NVC",
                "image": "https://shapeshift.io/images/coins/novacoin.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/novacoin.png",
                        "status": "unavailable"
    },
    "NXT": {
        "name": "Nxt",
            "symbol": "NXT",
                "specialReturn": false,
                    "image": "https://shapeshift.io/images/coins/nxt.png",
                        "imageSmall": "https://shapeshift.io/images/coins-sm/nxt.png",
                            "status": "available"
    },
    "OMG": {
        "name": "OmiseGo",
            "symbol": "OMG",
                "image": "https://shapeshift.io/images/coins/omisego.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/omisego.png",
                        "status": "available"
    },
    "POT": {
        "name": "Potcoin",
            "symbol": "POT",
                "image": "https://shapeshift.io/images/coins/potcoin.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/potcoin.png",
                        "status": "available"
    },
    "PPC": {
        "name": "Peercoin",
            "symbol": "PPC",
                "image": "https://shapeshift.io/images/coins/peercoin.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/peercoin.png",
                        "status": "unavailable"
    },
    "QTUM": {
        "name": "Qtum",
            "symbol": "QTUM",
                "image": "https://shapeshift.io/images/coins/qtum.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/qtum.png",
                        "status": "unavailable"
    },
    "REP": {
        "name": "Augur",
            "symbol": "REP",
                "image": "https://shapeshift.io/images/coins/augur.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/augur.png",
                        "status": "available"
    },
    "RDD": {
        "name": "Reddcoin",
            "symbol": "RDD",
                "image": "https://shapeshift.io/images/coins/reddcoin.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/reddcoin.png",
                        "status": "available"
    },
    "RCN": {
        "name": "RCN",
            "symbol": "RCN",
                "image": "https://shapeshift.io/images/coins/rcn.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/rcn.png",
                        "status": "available"
    },
    "RLC": {
        "name": "iExec",
            "symbol": "RLC",
                "image": "https://shapeshift.io/images/coins/iexec.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/iexec.png",
                        "status": "available"
    },
    "SALT": {
        "name": "Salt",
            "symbol": "SALT",
                "image": "https://shapeshift.io/images/coins/salt.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/salt.png",
                        "status": "available"
    },
    "SC": {
        "name": "Siacoin",
            "symbol": "SC",
                "image": "https://shapeshift.io/images/coins/siacoin.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/siacoin.png",
                        "status": "unavailable"
    },
    "SNT": {
        "name": "Status",
            "symbol": "SNT",
                "image": "https://shapeshift.io/images/coins/status.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/status.png",
                        "status": "available"
    },
    "STORJ": {
        "name": "Storj",
            "symbol": "STORJ",
                "image": "https://shapeshift.io/images/coins/storj.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/storj.png",
                        "status": "available"
    },
    "START": {
        "name": "Startcoin",
            "symbol": "START",
                "image": "https://shapeshift.io/images/coins/startcoin.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/startcoin.png",
                        "status": "available"
    },
    "STEEM": {
        "name": "Steem",
            "symbol": "STEEM",
                "specialReturn": false,
                    "specialOutgoing": true,
                        "specialIncoming": true,
                            "fieldName": "destTag",
                                "fieldKey": "destTag",
                                    "image": "https://shapeshift.io/images/coins/steem.png",
                                        "imageSmall": "https://shapeshift.io/images/coins-sm/steem.png",
                                            "status": "unavailable"
    },
    "SNGLS": {
        "name": "SingularDTV",
            "symbol": "SNGLS",
                "image": "https://shapeshift.io/images/coins/singular.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/singular.png",
                        "status": "unavailable"
    },
    "SWT": {
        "name": "Swarm City",
            "symbol": "SWT",
                "image": "https://shapeshift.io/images/coins/swarmcity.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/swarmcity.png",
                        "status": "available"
    },
    "TRST": {
        "name": "WeTrust",
            "symbol": "TRST",
                "image": "https://shapeshift.io/images/coins/wetrust.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/wetrust.png",
                        "status": "available"
    },
    "USDT": {
        "name": "Tether",
            "symbol": "USDT",
                "image": "https://shapeshift.io/images/coins/tether.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/tether.png",
                        "status": "unavailable"
    },
    "VOX": {
        "name": "Voxels",
            "symbol": "VOX",
                "image": "https://shapeshift.io/images/coins/voxels.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/voxels.png",
                        "status": "unavailable"
    },
    "VRC": {
        "name": "Vericoin",
            "symbol": "VRC",
                "image": "https://shapeshift.io/images/coins/vericoin.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/vericoin.png",
                        "status": "unavailable"
    },
    "VTC": {
        "name": "Vertcoin",
            "symbol": "VTC",
                "image": "https://shapeshift.io/images/coins/vertcoin.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/vertcoin.png",
                        "status": "available"
    },
    "WAVES": {
        "name": "Waves",
            "symbol": "WAVES",
                "image": "https://shapeshift.io/images/coins/waves.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/waves.png",
                        "status": "available"
    },
    "WINGS": {
        "name": "Wings",
            "symbol": "WINGS",
                "image": "https://shapeshift.io/images/coins/wings.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/wings.png",
                        "status": "available"
    },
    "XCP": {
        "name": "Counterparty",
            "symbol": "XCP",
                "image": "https://shapeshift.io/images/coins/counterparty.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/counterparty.png",
                        "status": "unavailable"
    },
    "XMR": {
        "name": "Monero",
            "symbol": "XMR",
                "specialReturn": false,
                    "specialOutgoing": true,
                        "specialIncoming": true,
                            "fieldName": "Payment Id",
                                "qrName": "tx_payment_id",
                                    "fieldKey": "paymentId",
                                        "image": "https://shapeshift.io/images/coins/monero.png",
                                            "imageSmall": "https://shapeshift.io/images/coins-sm/monero.png",
                                                "status": "available"
    },
    "XRP": {
        "name": "Ripple",
            "symbol": "XRP",
                "specialReturn": false,
                    "specialOutgoing": true,
                        "specialIncoming": true,
                            "fieldName": "Destination Tag",
                                "fieldKey": "destTag",
                                    "image": "https://shapeshift.io/images/coins/ripple.png",
                                        "imageSmall": "https://shapeshift.io/images/coins-sm/ripple.png",
                                            "status": "available"
    },
    "ZEC": {
        "name": "Zcash",
            "symbol": "ZEC",
                "image": "https://shapeshift.io/images/coins/zcash.png",
                    "imageSmall": "https://shapeshift.io/images/coins-sm/zcash.png",
                        "status": "available"
    },
    "ZRX": {
    "name": "0x",
    "symbol": "ZRX",
    "image": "https://shapeshift.io/images/coins/0x.png",
    "imageSmall": "https://shapeshift.io/images/coins-sm/0x.png",
    "status": "available"
    }
};

const changelly = [{ name: 'btc', fullName: 'Bitcoin', enabled: true },
{ name: 'eth', fullName: 'Ethereum', enabled: true },
{ name: 'etc', fullName: 'Ethereum Classic', enabled: false },
{ name: 'exp', fullName: 'Expanse', enabled: false },
{ name: 'xem', fullName: 'XEM (NEM)', enabled: false },
{ name: 'lsk', fullName: 'Lisk', enabled: true },
{ name: 'xmr', fullName: 'Monero', enabled: true },
{ name: 'game', fullName: 'GameCredits', enabled: true },
{ name: 'steem', fullName: 'Steem', enabled: false },
{ name: 'golos', fullName: 'Golos', enabled: false },
{ name: 'sbd', fullName: 'Steem Dollar', enabled: false },
{ name: 'zec', fullName: 'Zcash', enabled: true },
{ name: 'nlg', fullName: 'Gulden', enabled: true },
{ name: 'strat', fullName: 'Stratis', enabled: true },
{ name: 'ardr', fullName: 'Ardor', enabled: false },
{ name: 'rep', fullName: 'Augur', enabled: false },
{ name: 'lbc', fullName: 'LBRY Credits', enabled: false },
{ name: 'maid', fullName: 'MaidSafeCoin', enabled: false },
{ name: 'fct', fullName: 'Factom', enabled: false },
{ name: 'ltc', fullName: 'Litecoin', enabled: true },
{ name: 'bcn', fullName: 'Bytecoin', enabled: true },
{ name: 'xrp', fullName: 'Ripple', enabled: true },
{ name: 'doge', fullName: 'Dogecoin', enabled: true },
{ name: 'amp', fullName: 'Synereo', enabled: true },
{ name: 'nxt', fullName: 'Nxt', enabled: true },
{ name: 'dash', fullName: 'Dash', enabled: true },
{ name: 'dsh', fullName: 'Dashcoin', enabled: false },
{ name: 'rads', fullName: 'Radium', enabled: false },
{ name: 'xdn', fullName: 'DigitalNote', enabled: false },
{ name: 'aeon', fullName: 'AeonCoin', enabled: false },
{ name: 'nbt', fullName: 'NuBits', enabled: false },
{ name: 'fcn', fullName: 'FantomCoin', enabled: false },
{ name: 'qcn', fullName: 'QuazarCoin', enabled: false },
{ name: 'nav', fullName: 'NAV Coin', enabled: true },
{ name: 'pot', fullName: 'PotCoin', enabled: true },
{ name: 'gnt', fullName: 'Golem', enabled: false },
{ name: 'waves', fullName: 'Waves', enabled: true },
{ name: 'usdt', fullName: 'Tether USD', enabled: false },
{ name: 'swt', fullName: 'Swarm City', enabled: false },
{ name: 'mln', fullName: 'Melon', enabled: false },
{ name: 'dgd', fullName: 'DigixDAO', enabled: false },
{ name: 'time', fullName: 'Chronobank', enabled: false },
{ name: 'sngls', fullName: 'SingularDTV', enabled: false },
{ name: 'xaur', fullName: 'Xaurum', enabled: false },
{ name: 'pivx', fullName: 'PIVX', enabled: false },
{ name: 'gbg', fullName: 'Golos Gold', enabled: false },
{ name: 'trst', fullName: 'Trustcoin', enabled: false },
{ name: 'edg', fullName: 'Edgeless', enabled: false },
{ name: 'gbyte', fullName: 'Byteball', enabled: false },
{ name: 'dar', fullName: 'Darcrus', enabled: false },
{ name: 'wings', fullName: 'Wings DAO', enabled: false },
{ name: 'rlc', fullName: 'iEx.ec', enabled: false },
{ name: 'gno', fullName: 'Gnosis', enabled: false },
{ name: 'dcr', fullName: 'Decred', enabled: false },
{ name: 'gup', fullName: 'Guppy', enabled: false },
{ name: 'sys', fullName: 'Syscoin', enabled: true },
{ name: 'lun', fullName: 'Lunyr', enabled: false },
{ name: 'str', fullName: 'Stellar - XLM', enabled: true },
{
    name: 'bat',
    fullName: 'Basic Attention Token',
    enabled: false
},
{ name: 'ant', fullName: 'Aragon', enabled: false },
{ name: 'bnt', fullName: 'Bancor Network Token', enabled: false },
{ name: 'snt', fullName: 'Status Network Token', enabled: false },
{ name: 'cvc', fullName: 'Civic', enabled: false },
{ name: 'eos', fullName: 'EOS', enabled: false },
{ name: 'pay', fullName: 'TenXPay', enabled: false },
{ name: 'bch', fullName: 'Bitcoin Cash', enabled: true },
{ name: 'neo', fullName: 'Neo', enabled: false },
{ name: 'omg', fullName: 'OmiseGo', enabled: false },
{ name: 'mco', fullName: 'Monaco', enabled: false },
{ name: 'mtl', fullName: 'Metal', enabled: false },
{ name: '1st', fullName: 'FirstBlood', enabled: false },
{ name: 'adx', fullName: 'AdEx', enabled: false },
{ name: 'zrx', fullName: '0x Protocol Token', enabled: false },
{ name: 'dct', fullName: 'Decent', enabled: false },
{ name: 'ptoy', fullName: 'Patientory', enabled: false },
{ name: 'tkn', fullName: 'TokenCard', enabled: false },
{ name: 'storj', fullName: 'Storj', enabled: false },
{ name: 'cfi', fullName: 'Cofound.it', enabled: false },
{ name: 'fun', fullName: 'FunFair', enabled: false },
{ name: 'myst', fullName: 'Mysterium', enabled: false },
{ name: 'hmq', fullName: 'Humaniq', enabled: false },
{ name: 'nmr', fullName: 'Numeraire', enabled: false },
{ name: 'salt', fullName: 'Salt', enabled: false },
{ name: 'xvg', fullName: 'Verge', enabled: true },
{ name: 'btg', fullName: 'Bitcoin Gold', enabled: true },
{ name: 'dgb', fullName: 'DigiByte', enabled: true },
{ name: 'dnt', fullName: 'district0x', enabled: false },
{ name: 'vib', fullName: 'Viberate', enabled: false },
{ name: 'rcn', fullName: 'Ripio Credit Network', enabled: false },
{ name: 'powr', fullName: 'Power Ledger', enabled: false }];

changelly.forEach((coin) => {
    if (!Object.keys(shapeshift).includes(coin.name.toUpperCase())) {
        console.log(coin, "is missing");
        
    }
});

Promise.each(Object.keys(shapeshift), (coinSymbol) => {
    console.log(shapeshift[coinSymbol].image);
    // Download to a directory and save with an another filename
    const options = {
        url: shapeshift[coinSymbol].image,
        dest: `../coinImages/${coinSymbol}.png`        // Save to /path/to/dest/photo.jpg
    };
    
    return download.image(options)
    .then(({ filename, image }) => {
        console.log('File saved to', filename);
    })
    .catch((err) => {
        throw err;
    });
});