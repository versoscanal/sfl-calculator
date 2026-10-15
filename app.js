(function () {
  'use strict';

  const groups = [
    { name: 'Production', icon: '🌱', tools: [
      { key: 'animals', name: 'Animal Calculator', icon: '🐔', description: 'Feed, produce, time and net value.' },
      { key: 'farming', name: 'Farming Calculator', icon: '🌾', description: 'Estimate crop yield, costs and returns.' },
      { key: 'honey', name: 'Honey Calculator', icon: '🍯', description: 'Compare hive output and honey value.' },
      { key: 'pets', name: 'Pet Calculator', icon: '🐾', description: 'Review pet growth and rewards.' },
      { key: 'resources', name: 'Resources Calculator', icon: '🪨', description: 'Estimate resource collection.' }
    ]},
    { name: 'Food & XP', icon: '🍲', tools: [
      { key: 'bumpkin-level', name: 'Bumpkin Level Calculator', icon: '🧑‍🌾', description: 'Plan experience and level progress.' },
      { key: 'cooking', name: 'Cooking Calculator', icon: '🥘', description: 'Compare recipe cost, output and XP.' },
      { key: 'utility', name: 'Utility (Composter & Aging Shed)', icon: '🪴', description: 'Plan composting and aging cycles.' }
    ]},
    { name: 'Progression', icon: '🧭', tools: [
      { key: 'collectibles', name: 'Boost SFTs & Collectibles', icon: '🪄', description: 'Browse boosts and collectible effects.' },
      { key: 'chapter-race', name: 'Chapter Race Tracker', icon: '🎟️', description: 'Project tickets and chapter totals.' },
      { key: 'coin-converter', name: 'Coin Converter', icon: '🪙', description: 'Convert SFL and Coins at a sample rate.' },
      { key: 'inventory-diff', name: 'Daily Inventory Diff', icon: '📈', description: 'Compare two inventory snapshots.' },
      { key: 'expansion', name: 'Expansion Calculator', icon: '🗺️', description: 'Estimate land expansion requirements.' },
      { key: 'faction', name: 'Faction Calculator', icon: '🛡️', description: 'Plan faction contributions.' },
      { key: 'farm-layout', name: 'Farm Layout', icon: '🧩', description: 'Arrange plots and farm structures.' },
      { key: 'forge', name: 'Forge Calculator', icon: '⚒️', description: 'Review craft requirements and costs.' },
      { key: 'inventory-calculator', name: 'Inventory Calculator', icon: '🎒', description: 'Estimate item totals and needs.' },
      { key: 'resource-node-exchange', name: 'Resource Node Exchange', icon: '🔁', description: 'Compare resource node exchanges.' },
      { key: 'skills', name: 'Skill Simulator', icon: '✨', description: 'Allocate ranks and estimate upgrade costs.' }
    ]},
    { name: 'Tools', icon: '🧰', tools: [
      { key: 'auctions', name: 'Auction Results', icon: '🏷️', description: 'Review auction prices and outcomes.' },
      { key: 'delivery-tasks', name: 'Chapter NPC Tasks', icon: '📦', description: 'Plan chapter delivery requirements.' },
      { key: 'chests', name: 'Chest Rewards', icon: '🎁', description: 'Explore chest reward information.' },
      { key: 'crafting-box-recipe', name: 'Crafting Box Recipes', icon: '🧰', description: 'Look up crafting box recipes.' },
      { key: 'crustaceans', name: 'Crustaceans Calculator', icon: '🦀', description: 'Estimate crustacean yields.' },
      { key: 'expansion-race', name: 'Expansion Race', icon: '🏁', description: 'Compare expansion race goals.' },
      { key: 'faction-leaderboard', name: 'Faction Leaderboard', icon: '🏆', description: 'Browse faction rankings.' },
      { key: 'flower-recipes', name: 'Flower Recipes', icon: '🌷', description: 'Compare flower combinations.' },
      { key: 'marvel-simulator', name: 'Marvel Simulator', icon: '🔮', description: 'Explore marvel combinations.' },
      { key: 'notifications', name: 'Notifications', icon: '🔔', description: 'Set up local reminder preferences.' },
      { key: 'prng-simulator', name: 'PRNG Simulator', icon: '🎲', description: 'Run a local illustrative sequence.' },
      { key: 'process-food', name: 'Process Food Calculator', icon: '🥫', description: 'Estimate processed food output.' },
      { key: 'settings', name: 'Settings', icon: '⚙️', description: 'Adjust local preview preferences.' },
      { key: 'shrines', name: 'Shrines Calculator', icon: '⛩️', description: 'Compare shrine effects.' },
      { key: 'statistics', name: 'Statistics', icon: '📊', description: 'View sample farm statistics.' },
      { key: 'guide', name: 'User Guide', icon: '📖', description: 'Learn how the tool suite is organized.' }
    ]}
  ];

  const routeIndex = Object.create(null);
  groups.forEach(function (group) {
    group.tools.forEach(function (tool) {
      tool.group = group.name;
      routeIndex[tool.key] = tool;
    });
  });

  const state = {
    openMenu: null,
    mobileMenu: false,
    modal: false,
    demoFarm: false,
    converterDirection: 'sfl',
    farmTab: 'Crops Calculator',
    guideTopic: 'Quick Start',
    ranks: { farming: 1, cooking: 1, animals: 1, market: 0, gathering: 0 },
    prngMode: 'Crops',
    prngValues: [],
    previewSelections: Object.create(null)
  };

  const app = document.getElementById('app');
  const cropExamples = {
    Wheat: { yield: 1, price: 0.018, cost: 0.006, hours: 0.5 },
    Carrot: { yield: 1, price: 0.052, cost: 0.021, hours: 4 },
    Pumpkin: { yield: 1, price: 0.178, cost: 0.084, hours: 12 },
    Sunflower: { yield: 1, price: 0.41, cost: 0.19, hours: 48 }
  };
  const recipeExamples = {
    'Pumpkin Soup': { cost: 0.62, price: 0.88, xp: 34 },
    'Carrot Cake': { cost: 0.45, price: 0.7, xp: 28 },
    'Berry Jam': { cost: 0.31, price: 0.49, xp: 19 }
  };
  const guideCopy = {
    'Quick Start': ['Connect a Farm ID in the original utility to synchronize public farm data. This local preview does not connect to the game.', 'Open a calculator from the menus and adjust the assumptions to explore the interface.'],
    'Dashboard & Timers': ['The original dashboard groups crop, animal and production timers after farm data loads.', 'This reconstruction includes sample timers only; it does not query a live farm.'],
    'Profit Calculators': ['Farming, animal and cooking previews expose editable costs, yields and cycle times.', 'The values shown here are examples. Replace them with current game or market data before using the estimates.'],
    'Market & FLOWER': ['The source site presents cached P2P prices and a Coin-to-SFL converter.', 'This preview uses a clearly labeled sample rate and never calls a market API.'],
    'Simulators': ['The source navigation includes skill and PRNG simulators.', 'The local PRNG screen generates a deterministic illustrative sequence; it does not predict game outcomes.'],
    'Push Alerts & PWA': ['The source advertises offline notifications through PWA and messaging integrations.', 'Notification delivery is not enabled in this local reconstruction.'],
    'Frequently Asked Questions': ['This is an unofficial community-style interface reconstruction.', 'No wallet, signature, Farm ID storage, game API, or transaction is used by this preview.']
  };
  const observedScreens = {
    honey: { title: 'Honey Calculator', group: 'PRODUCTION', description: 'Estimate beehive yield, cycle time and revenue.', panel: 'Beehive settings', stats: [['Daily yield', '1.0000 Honey', '🍯', 'sample capture'], ['Market price', '0.109058 SFL', '✿', 'captured reference'], ['Coin rate', '1,367.78', '🪙', 'captured reference'], ['Tax', '0.0%', '⌁', 'captured reference']], fields: [['hives', 'Beehives', '1', 'hives'], ['hive-days', 'Full hive duration', '1', 'day'], ['honey-price', 'Honey price', '0.109058', 'SFL'], ['honey-tax', 'Market tax', '0', '%']], buttons: ['Production Speed', 'Bee Swarm Chance +10%', 'Yield Addition +0'], rows: [['Honey per cycle', '1.0000'], ['Revenue per cycle', '0.1091 SFL'], ['Daily expected', '0.1091 SFL']], note: 'The displayed prices and yield were observed during the REA capture; this is not live market data.' },
    pets: { title: 'Pet Calculator', group: 'PRODUCTION', description: 'Simulate pet feeding and compare XP, energy and fetch-yield boosts.', panel: 'Simulator settings', fields: [['pet-feeds', 'Feed actions', '10', 'feeds'], ['pet-cost', 'Average cost per energy', '0.25', 'SFL'], ['pet-xp', 'XP per feed', '100', 'XP'], ['pet-fetch', 'Fetch yield', '1', 'items']], buttons: ['Common Pet', 'NFT Pet', 'No Aura', 'Common Aura (+1.5x)', 'Rare Aura (+2x)', 'Mythic Aura (+3x)', 'No Bib', 'Collar (+5 XP)', 'Gold Necklace (+10 XP)'], rows: [['Boost families', 'Energy · XP · Yield · Utility'], ['Sample pet types', 'Common · NFT'], ['Data source', 'Local inputs only']], note: 'The source page includes additional game boosts. Values here are interface examples, not a game-connected result.' },
    resources: { title: 'Resources Calculator', group: 'PRODUCTION', description: 'Select resources and review a planning board for tools, output and costs.', panel: 'Simulation board', fields: [['resource-hours', 'Active hours', '8', 'hours'], ['resource-tools', 'Tool quantity', '1', 'tool'], ['resource-units', 'Planned actions', '10', 'actions']], buttons: ['Restock Mode', 'Active Hours', 'Restock', 'Free Restock', '1 Tool', 'Clear'], checks: ['Wood', 'Stone', 'Iron', 'Gold', 'Crimstone', 'Oil', 'Obsidian', 'Salt'], rows: [['Board mode', 'Restock or active hours'], ['Selected resources', 'Choose from the checklist'], ['Calculation', 'Production less dependencies']], note: 'The source board subtracts tool and building dependencies. Exact node balances require connected farm data.' },
    'bumpkin-level': { title: 'Bumpkin Level Calculator', group: 'FOOD & XP', description: 'Estimate food experience requirements and target-level progress.', panel: 'Experience summary', stats: [['Current level', 'Level 1', '🧑‍🌾', 'sample state'], ['Current experience', '0 XP', '✨', 'sample state'], ['Ascension choices', 'No Asc. – 15', '⬆', 'observed selector'], ['Mode', 'Custom quantities', '🍲', 'sample state']], fields: [['bumpkin-level', 'Current level', '1', 'level'], ['bumpkin-xp', 'Current experience', '0', 'XP'], ['bumpkin-target', 'Target level', '10', 'level'], ['bumpkin-food-xp', 'XP per food', '34', 'XP']], buttons: ['Farm Data', 'Custom', 'Use Inventory Quantities', 'Custom Quantities', 'MAX'], rows: [['Planner input', 'Food experience'], ['Ascension', 'No Asc. to Asc. 15']], note: 'The underlying level curve and farm inventory were not available in this no-Farm-ID capture.' },
    utility: { title: 'Utilities (Composter & Aging Shed)', group: 'FOOD & XP', description: 'Explore the source utility modules for composting, fish aging and processing.', panel: 'Utility modules', stats: [['Target output', '10 Sprout Mix', '🪴', 'captured preview'], ['Worms', '~3.0', '🪱', 'captured preview'], ['Cycle time', '6h 0m', '◷', 'captured preview'], ['Unit cost', '0.0016 SFL', '✿', 'captured reference']], buttons: ['Composter Calculator', 'Fishing Calculator', 'Aging Fish Calculator', 'Fermentation Calculator', 'Spice Calculator', 'Jafar Calculator'], rows: [['Season total cost', '0.0156 SFL · captured reference'], ['Spring inputs', 'Rhubarb · Carrot'], ['Boosts', 'Yield · time reduction · other']], note: 'Values and seasonal costs are a snapshot from the REA observation, not current market data.' },
    collectibles: { title: 'Boost SFTs & Collectibles', group: 'PROGRESSION', description: 'Browse owned boost items, marketplace listings and collection valuation.', panel: 'Collection overview', stats: [['Boost items owned', '0 / 356', '🪄', 'snapshot 2026-10-14'], ['Total SFT value', '0 FLOWER', '✿', 'snapshot 2026-10-14'], ['Unique SFTs', '0', '▦', 'snapshot 2026-10-14'], ['Complete collection', '802,648.43 FLOWER', '◇', 'historical reference']], fields: [['collectible-search', 'Search items or boosts', '', 'name']], buttons: ['All (356)', 'Owned (0)', 'Missing (356)', 'Plan to Buy', 'Collectibles', 'Wearables', 'All Categories', 'Bumpkin XP', 'Chicken'], rows: [['Data date', '2026-10-14'], ['Collection cost', 'USD value was shown by the original page']], note: 'All inventory and valuation figures are historical public-page observations.' },
    'inventory-diff': { title: 'Daily Inventory Diff', group: 'PROGRESSION', description: 'Track changes between farm inventory snapshots.', panel: 'Farm connection', empty: 'No diff data found. The original page asks for a Player Farm ID before tracking inventory changes.', fields: [['diff-farm-id', 'Enter Player Farm ID', '', 'not stored']], buttons: ['Save Farm', 'Back to Dashboard'], rows: [['Tracking', 'Changes appear when inventory updates'], ['Local preview', 'No ID is saved or sent']], note: 'This preview does not accept or store a Farm ID.' },
    expansion: { title: 'Expansion Calculator', group: 'PROGRESSION', description: 'Plan island expansion requirements and compare map routes.', panel: 'Map planner', fields: [['expansion-start', 'Start expansion', '4', 'land'], ['expansion-target', 'Target expansion', '4', 'land'], ['expansion-level', 'Bumpkin level', '1', 'level'], ['expansion-resources', 'Available resource units', '0', 'units']], buttons: ['Basic', 'Spring', 'Desert', 'Volcano', 'Swamp (A1)', 'Spooky (A2)', 'Crystal (A3)', 'Galaxy (A4)', 'Marble (A5+)'], rows: [['Map filters', 'Crop Plot · Tree · Stone Rock · Iron Rock · Gold Rock'], ['Boost examples', 'Grinx’s Hammer · VIP Pass · Ascension Monument'], ['Current route', 'Basic 4 → Basic 4']], note: 'The original page exposes island maps and resource filters; this preview does not model every expansion recipe.' },
    faction: { title: 'Faction Calculator', group: 'PROGRESSION', description: 'Plan Marks from Faction Kitchen and pet donations.', panel: 'Faction connection', empty: 'No Faction Found. Join a faction in Sunflower Land to use the original calculator.', buttons: ['Connect Farm', 'Faction Leaderboard'], rows: [['Donation types', 'Faction Kitchen · Pets'], ['Required data', 'Farm and faction membership']], note: 'No faction or farm data was loaded in the REA observation.' },
    'farm-layout': { title: 'Farm Layout Simulator', group: 'PROGRESSION', description: 'Arrange plots, buildings, minerals and booster placements on a farm grid.', panel: 'Layout controls', fields: [['layout-expansions', 'Expansions', '3', 'of 9'], ['layout-zoom', 'Zoom', '90', '%']], buttons: ['Basic Island', 'Spring Island', 'Desert Island', 'Volcano Island', 'Swamp Island (A1)', 'Spooky Island (A2)', 'Crystal Island (A3)', 'Galaxy Island (A4)', 'Marble Island (A5+)', 'Paths', 'Grid', 'AOE Auras', 'Dark Mode', 'Light Mode'], rows: [['Sandbox', 'Interactive placement preview'], ['Aura grids', '3×3 · 7×7 · 8×8 · 9×9']], note: 'The local screen is a simplified layout sandbox; the original farm state was not connected.' },
    forge: { title: 'Node Forge Simulator', group: 'PROGRESSION', description: 'Plan resource-node upgrades and review sample cost and deficit fields.', panel: 'Forge cost & deficit summary', stats: [['Planned upgrades', '0', '⚒️', 'sample state'], ['Total Coin cost', '0', '🪙', 'sample state'], ['Obsidian cost', '0', '◈', 'sample state'], ['Obsidian value deficit', '0.00 FLOWER', '✿', 'sample state']], fields: [['forge-owned', 'Current owned nodes', '16', 'nodes'], ['forge-t2', 'Target Tier 2 nodes', '0', 'nodes'], ['forge-t3', 'Target Tier 3 nodes', '0', 'nodes'], ['forge-obsidian', 'Obsidian available', '0', 'units']], buttons: ['Market Price', 'Self Produce', 'Max T2 (4)', 'Max T3 (0)', 'Reset Forges'], rows: [['Node example', 'Tree · Wood yield · Axe'], ['Starting state', 'No farm connected; default baseline']], note: 'Exact forge costs depend on current farm inventory and the live node definitions.' },
    'inventory-calculator': { title: 'Inventory Value Calculator', group: 'PROGRESSION', description: 'Estimate the gross and net value of selected inventory at a chosen tax rate.', panel: 'Simulation & tax settings', stats: [['Gross value', '0.00 FLOWER', '✿', 'sample state'], ['Units selected', '0 / 66', '▦', 'sample state'], ['Estimated tax', '55%', '⌁', 'Spring reference'], ['Net value', '0.00 FLOWER', '◇', 'sample state']], fields: [['inventory-search', 'Search items', '', 'name'], ['inventory-tax', 'Tax rate', '55', '%'], ['inventory-price', 'Unit value', '0.15', 'FLOWER'], ['inventory-count', 'Selected units', '0', 'items']], buttons: ['Select All', 'Deselect All', 'Select Owned (> 0)', 'Sell 100% All', 'Clear (0%)', 'Basic 100% Tax', 'Spring 55% Tax', 'Desert 25% Tax', 'Volcano+ 15% Tax'], rows: [['Market data', 'Original site updates prices periodically'], ['Trade boost', 'Trading Shrine reduces tax']], note: 'Tax rates and item prices are shown as captured reference values, not live prices.' },
    'resource-node-exchange': { title: 'Resource Node Exchange', group: 'PROGRESSION', description: 'Estimate Sunstone and Obsidian requirements for expansion-node exchanges.', panel: 'Exchange nodes', rows: [['Crimstone Rock', '20 Sunstone · +20 per increase'], ['Crop Plot', '3 Sunstone · +2 per increase'], ['Flower Bed', '30 Sunstone · +25 per increase'], ['Total', '0 nodes selected']], buttons: ['−', '+', 'Increase'], note: 'The source page lists node exchange costs. Additional node variants are available in the original module.' },
    auctions: { title: 'Auction Results & Rates', group: 'TOOLS', description: 'Review historical auction outcomes, winner cutoffs and valuation rates.', panel: 'Auction browser', fields: [['auction-search', 'Search prize name or ID', '', 'name']], buttons: ['All Auctions', 'Gem Auctions', 'Flower Auctions', 'Ticket Auctions', 'Wearables', 'Collectibles', 'Pets & NFTs', 'Custom Simulation'], rows: [['Sort options', 'Newest · Oldest · Highest cutoff · Lowest cutoff · Highest supply'], ['Data', 'Historical auction data was loading during capture']], note: 'Auction results require the source data service and are not fetched in this local preview.' },
    'delivery-tasks': { title: 'Chapter NPC Delivery Tasks', group: 'TOOLS', description: 'Browse recorded chapter delivery tasks and ingredient-cost analysis.', panel: 'Task filters', stats: [['Tasks recorded', '0', '📦', 'captured state'], ['Chapter', 'Ascension Age', '🎟️', 'captured state'], ['Currencies', 'FLOWER · Coins · Tickets', '✿', 'observed filters'], ['Orders', 'Active Orders', '◈', 'original route']], buttons: ['FLOWER', 'Coins', 'Tickets', 'Ascension Age', 'Active Orders'], rows: [['Task data', 'No task rows were available in the observed capture']], note: 'The original page describes a crowdsourced task database. The local preview does not load that database.' },
    chests: { title: 'Chest & Reward Boxes', group: 'TOOLS', description: 'Browse chest and reward-box categories and drop-probability screens.', panel: 'Reward categories', buttons: ['Bud Box', 'Desert Streak', 'Festive Tree', 'Flower Boxes', 'Food Boxes', 'Gift Giver', 'Love Boxes', 'Floating Island Daily Prize', 'Maneki Neko', 'Pirate Chest', 'Tool Boxes'], rows: [['Selected category', 'Choose a box to inspect its rewards'], ['Probability data', 'Not copied into the local preview']], note: 'No drop probabilities are invented here; the captured page showed category selectors.' },
    'crafting-box-recipe': { title: 'Crafting Box Recipes', group: 'TOOLS', description: 'Browse recipe requirements by dolls, ingredients and beds.', panel: 'Recipe collection', buttons: ['Dolls', 'Ingredients', 'Beds'], rows: [['Angler Doll', 'Kelp Fibre · 4.5284 FLOWER reference'], ['Bigfin Doll', 'Angler Doll · 39.2169 FLOWER reference']], note: 'Recipe prices were observed during the REA capture and may have changed.' },
    crustaceans: { title: 'Crustaceans Calculator', group: 'TOOLS', description: 'Compare pot costs, catch times and example crustacean yields.', panel: 'Pot options', stats: [['Crab Pot', '04:00:00', '🦀', 'captured duration'], ['Mariner Pot', '08:00:00', '🦞', 'captured duration'], ['Crab Pot cost', '250 Coins', '🪙', 'captured reference'], ['Mariner Pot cost', '500 Coins', '🪙', 'captured reference']], rows: [['Crab Pot materials', '5 Feather · 3 Wool'], ['Mariner Pot materials', '10 Feather · 10 Merino Wool'], ['Boosts', 'Crab House · Pistol Shrimp · Crystal Altar · Speed Trap']], note: 'Material prices are stale references from the observed page.' },
    'expansion-race': { title: 'Expansion Race', group: 'TOOLS', description: 'Browse the public expansion leaderboard and compare frontier progress.', panel: 'Historical leaderboard snapshot', stats: [['Nightly dump', '2026-10-14', '📅', 'captured date'], ['Last sync', '1m ago', '◷', 'at capture time'], ['Top rank', '1', '🏆', 'captured row'], ['Current build', 'Land 38', '🗺️', 'captured row']], buttons: ['Top 10', 'Top 25', 'Top 50'], rows: [['1 · Tourist', 'Galaxy · A4 · 12 Lava Pits'], ['Progress', '38 / 42 lands'], ['Boosts', 'Hammer · Monument · Obsidian Turtle']], note: 'Leaderboard entries are historical public data captured on 2026-10-15, not current rankings.' },
    'faction-leaderboard': { title: 'Faction Weekly Leaderboard', group: 'TOOLS', description: 'Compare weekly faction standings and player marks.', panel: 'Historical faction standings', stats: [['Week of', '2026-10-05', '📅', 'captured period'], ['Data dump', '2026-10-12', '◷', 'captured date'], ['Champion', 'Goblins', '🏆', 'captured row'], ['Top 100 marks', '1,049,941.2', '✦', 'historical reference']], buttons: ['Refresh', 'Goblins', 'Nightshades', 'Sunflorians', 'Bumpkins'], rows: [['1 · Goblins', '1,049,941.2 Marks'], ['2 · Nightshades', '1,027,355 Marks'], ['3 · Sunflorians', '1,000,018.4 Marks']], note: 'Standings and marks are historical observations from the REA capture.' },
    'flower-recipes': { title: 'Flower Recipes', group: 'TOOLS', description: 'Compare sample flower growth, seed costs and yield-boost controls.', panel: 'Flower inventory simulator', stats: [['Power skill', 'Petal Blessed', '🌷', 'observed control'], ['Seed example', 'Sunpetal Seed', '🌱', 'captured page'], ['Growth time', '1 day', '◷', 'captured row'], ['Boost controls', 'Yield · time · cost', '✨', 'observed groups']], buttons: ['Off', 'Lv 1', 'Lv 2', 'Lv 3', 'Luna’s Crescent -50%', 'Red Pansy', 'Yellow Pansy'], rows: [['Red Pansy', '71.52 Coins · 0.0523 SFL reference'], ['Yellow Pansy', '27.92 Coins · 0.0204 SFL reference']], note: 'Seed prices and outputs are historical captured values, not live market data.' },
    'marvel-simulator': { title: 'Marine Marvel Simulator', group: 'TOOLS', description: 'Track map pieces and review sample fishing reel estimates.', panel: 'Marvel progress', stats: [['Crocodile pieces', '0 / 9', '🐊', 'captured sample'], ['Moray Eel drop', '1.50%', '🐟', 'captured reference'], ['Reels for one piece', '~66.67', '🎣', 'captured estimate'], ['Reels for all 9', '~600', '🎣', 'captured estimate']], buttons: ['All', 'Incomplete', 'Completed', 'Deep Sea Helm', 'Full Moon', 'Navigation Table', 'Spring Guardian'], rows: [['Chapter', 'Ascension Age'], ['Boost state', 'No active boosts'], ['Example bait', 'Earthworm · Grub · Fishing Lure']], note: 'Drop probabilities are preserved as a historical example; they are not predictions of current game RNG.' },
    notifications: { title: 'Notification Center', group: 'TOOLS', description: 'Configure the notification preferences shown by the source application.', panel: 'Notification settings', empty: 'Set a Farm ID in the original utility to configure alerts. This local reconstruction does not store or send it.', fields: [['notification-farm-id', 'Owner Farm ID', '', 'not stored']], buttons: ['Browser (PWA)', 'Discord', 'Telegram', 'WeChat', 'Save All', 'Cancel'], rows: [['Browser alerts', 'PWA notifications'], ['Chat bridges', 'Webhook integrations'], ['Warning offsets', 'Custom early alerts']], note: 'No Farm ID, webhook, push permission or notification is saved or transmitted here.' },
    'process-food': { title: 'Process Food Calculator', group: 'TOOLS', description: 'Compare sample processing time, yield and ingredient cost.', panel: 'Processing recipes', stats: [['Fish Flake', '01:00:00', '🐟', 'captured duration'], ['Fish Stick', '02:00:00', '🍢', 'captured duration'], ['Crab Stick', '04:00:00', '🦀', 'captured duration'], ['Fish Oil', '16:00:00', '🫙', 'captured duration']], buttons: ['All Seasons', 'Spring', 'Fish Price Breakdown', 'Bubble Aura -20% Time'], rows: [['Fish Flake', 'Average cost 1.2358 FLOWER'], ['Fish Stick', 'Average cost 2.9915 FLOWER'], ['Crab Stick', 'Average cost 0.0110 FLOWER'], ['Fish Oil', 'Average cost 2.8801 FLOWER']], note: 'Recipe prices and seasonal values are historical captured references.' },
    settings: { title: 'Settings', group: 'TOOLS', description: 'Review the saved-farm and backup areas visible in the source utility.', panel: 'Local preview settings', stats: [['Saved farms', '0 / 6', '👥', 'captured state'], ['Backup', 'Not configured', '▣', 'local preview'], ['Sync', 'Unavailable', '↔', 'not connected'], ['Preferences', 'Browser only', '⚙️', 'not persisted']], buttons: ['Use', 'Edit', 'Sync to Device / Mobile', 'Enter Sync Code'], rows: [['Friends', 'Up to 6 saved-farm slots in the source'], ['Backup & Restore', 'QR transfer, backup file and clipboard in the source']], note: 'This reconstruction does not persist saved farms or sync codes.' },
    shrines: { title: 'Shrines Calculator', group: 'TOOLS', description: 'Select shrines and review sample resource and duration requirements.', panel: 'Available shrines', buttons: ['Select All', 'Clear', 'Legendary Shrine', 'Obsidian Shrine'], rows: [['Legendary Shrine', '1 Obsidian · 10 Moonfur · 15 Acorn'], ['Captured sample cost', '45.7100 FLOWER'], ['Obsidian Shrine', '1 Obsidian · 3 Moonfur'], ['Captured daily cost', '1.9250 FLOWER / day']], note: 'These shrine requirements and costs were visible in the REA capture; current costs may differ.' },
    statistics: { title: 'Sunflower Land Statistics', group: 'TOOLS', description: 'Browse the public economy and island-statistics screen using a dated snapshot.', panel: 'Historical public snapshot', stats: [['Registered farms', '804,585', '🚜', 'data date 2026-10-14'], ['Active farms (90d)', '80,788', '🌱', '10.0% of total'], ['VIP pass holders', '17,055', '👑', 'captured value'], ['Desert streaks (7d+)', '3,815', '⛏️', 'captured value']], fields: [['statistics-search', 'Search item, biome or token', '', 'name']], buttons: ['All', 'Island Biomes', 'General Economy', 'Current Chapter SFTs', 'Mutant Animals', 'Rare Flowers', 'Marvel Fish', 'Seasonal Banners'], rows: [['Data date', '2026-10-14'], ['Last updated', '2026-10-15 · 01:39 UTC']], note: 'All statistics are historical values captured from the public page on 2026-10-15.' }
  };

  function escapeText(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }

  function currentRoute() {
    const key = window.location.hash.replace(/^#\/?/, '').split('?')[0];
    return key || 'home';
  }

  function routeLink(key, label, className, icon) {
    return '<a class="' + (className || '') + '" href="#/' + key + '" data-route="' + key + '">' +
      (icon ? '<span aria-hidden="true">' + icon + '</span>' : '') + label + '</a>';
  }

  function renderHeader(route) {
    const navGroups = groups.map(function (group) {
      const expanded = state.openMenu === group.name;
      const menuLinks = group.tools.map(function (tool) {
        return '<a class="dropdown-link' + (route === tool.key ? ' active' : '') + '" href="#/' + tool.key + '" data-route="' + tool.key + '"><span class="dropdown-icon" aria-hidden="true">' + tool.icon + '</span><span>' + escapeText(tool.name) + '</span></a>';
      }).join('');
      return '<div class="nav-entry"><button class="nav-trigger" type="button" aria-expanded="' + expanded + '" aria-haspopup="true" data-menu="' + group.name + '"><span>' + group.name + '</span><span class="nav-chevron" aria-hidden="true">⌄</span></button>' +
        (expanded ? '<div class="dropdown" role="menu"><div class="dropdown-label">' + group.name + ' · ' + group.tools.length + ' tools</div>' + menuLinks + '</div>' : '') + '</div>';
    }).join('');

    return '<header class="topbar"><div class="topbar-inner">' +
      routeLink('home', '<span class="brand-mark" aria-hidden="true">✿</span><span><span class="brand-name">SFL Calculator</span><span class="brand-caption">Farm tools & analytics</span></span>', 'brand') +
      '<nav class="primary-nav' + (state.mobileMenu ? ' mobile-open' : '') + '" aria-label="Main navigation">' +
      routeLink('dashboard', 'Dashboard', 'nav-link' + (route === 'dashboard' ? ' active' : '')) + navGroups + '</nav>' +
      '<div class="rate-chip" title="Illustrative value from the REA observation; not live market data"><span class="rate-dot" aria-hidden="true"></span><span><span class="rate-label">Sample rate</span><span class="rate-value">1,367.78 <span style="color:#99ad9d;font-weight:500">COINS / SFL</span></span></span></div>' +
      '<button class="mobile-menu" type="button" aria-label="Toggle navigation" aria-expanded="' + state.mobileMenu + '" data-action="mobile-menu">☰</button>' +
      '</div></header>';
  }

  function renderFooter() {
    return '<footer class="site-footer"><div class="footer-inner"><span>Unofficial local interface reconstruction · no wallet or live farm connection</span><div class="footer-links">' +
      routeLink('guide', 'User Guide', '') + routeLink('catalog', 'All tools', '') + routeLink('dashboard', 'Dashboard', '') +
      '</div></div></footer>';
  }

  function pageTitle(title, description, eyebrow) {
    return '<div class="page-titlebar"><div><span class="eyebrow"><span class="eyebrow-dot"></span>' + (eyebrow || 'SFL TOOL SUITE') + '</span><h1>' + title + '</h1><p>' + description + '</p></div>' +
      '<div class="title-actions"><span class="badge neutral">LOCAL PREVIEW</span></div></div>';
  }

  function metric(label, value, icon, change) {
    return '<div class="metric-card"><div class="metric-top"><span>' + label + '</span><span class="metric-icon" aria-hidden="true">' + icon + '</span></div><div class="metric-value">' + value + '</div><div class="metric-change">' + change + '</div></div>';
  }

  function renderHome() {
    const features = [
      ['🌿', 'Live Farm Sync & Dashboard', 'A unified view of crops, greenhouse, animals, beehives, production timers and daily collectables.'],
      ['🪙', 'P2P Market & Coin Converter', 'Compare a sample Coin-to-SFL rate and explore profit-per-cycle estimates.'],
      ['⏰', 'Offline Alerts', 'The source site describes push alerts for crop and animal timers. Delivery is not enabled in this preview.'],
      ['🎟️', 'Chapter Race & Season Tickets', 'Project a ticket total from current progress, daily rewards and days remaining.'],
      ['🥘', 'Cooking & Bumpkin XP Planner', 'Estimate recipe costs, returns and experience with editable assumptions.'],
      ['🧭', 'Simulators & Progression Tools', 'Browse skill planning, expansion, faction and simulator screens from the original navigation.']
    ];
    return '<main class="page-shell"><section class="hero"><div class="hero-copy"><span class="eyebrow"><span class="eyebrow-dot"></span>ALL-IN-ONE SUNFLOWER LAND SUITE</span><h1>SFL Calculator <span>& Analytics</span></h1><p>A practical toolkit for planning farm production, comparing costs and tracking progression across Sunflower Land.</p><div class="hero-actions">' +
      routeLink('dashboard', 'Open Dashboard <span aria-hidden="true">↗</span>', 'button primary') + routeLink('coin-converter', 'Coin Converter', 'button secondary') + routeLink('chapter-race', 'Chapter Race', 'button secondary') +
      '</div><div class="hero-note"><span class="shield" aria-hidden="true">◈</span>Unofficial community-style utility · zero wallet signatures</div></div>' +
      '<div class="hero-art" aria-hidden="true"><div class="art-orbit"></div><div class="sunflower">🌻</div><div class="float-card top"><span class="float-caption">Field productivity</span><span class="float-value">+18.4% <span style="color:#91a597;font-size:10px;font-weight:500">week</span></span></div><div class="float-card bottom"><span class="float-caption">Harvest queue</span><span class="float-value gold">08 <span style="color:#91a597;font-size:10px;font-weight:500">ready soon</span></span></div></div></section>' +
      '<section class="feature-section"><div class="section-heading"><div><span class="eyebrow">BUILT FOR YOUR FARM</span><h2>Everything in one place</h2></div><p>Explore the calculator categories captured from the public site. Core previews work locally with editable example values.</p></div><div class="feature-grid">' + features.map(function (feature, index) {
        return '<article class="feature-card"><div class="feature-icon" aria-hidden="true">' + feature[0] + '</div><h3>' + feature[1] + '</h3><p>' + feature[2] + '</p></article>';
      }).join('') + '</div></section>' +
      '<section class="privacy-panel"><div><span class="eyebrow">PRIVACY & TRANSPARENCY</span><h3 style="margin-top:9px">Your farm data stays yours</h3><p>This reconstruction runs in your browser and makes no network requests. Farm ID sync, saved farms, live prices, push alerts and game-connected calculations are not enabled here. The original site presents itself as an unofficial community utility with no wallet connection or signatures required.</p></div><div class="privacy-icon" aria-hidden="true">◈</div></section>' +
      '<section class="feature-section"><div class="section-heading"><div><span class="eyebrow">35 ROUTES OBSERVED</span><h2>Choose a tool</h2></div>' + routeLink('catalog', 'Browse all tools →', 'button ghost') + '</div><div class="generic-grid">' + groups.map(function (group) {
        return '<a class="tool-tile" href="#/' + group.tools[0].key + '" data-route="' + group.tools[0].key + '"><div class="feature-icon" aria-hidden="true">' + group.icon + '</div><strong>' + group.name + '</strong><span>' + group.tools.length + ' screens · ' + group.tools.slice(0, 2).map(function (t) { return t.name; }).join(' · ') + '</span></a>';
      }).join('') + '</div></section></main>';
  }

  function renderDashboard() {
    if (!state.demoFarm) {
      return '<main class="page-shell">' + pageTitle('Dashboard', 'Track crop, animal and production timers in one place.', 'FARM OVERVIEW') +
        '<section class="farm-empty"><div class="empty-illustration" aria-hidden="true">⌂</div><h2>No farm data found</h2><p>Please connect your farm first. This local reconstruction does not connect to Sunflower Land; you can open a sample dashboard to explore the layout.</p>' +
        '<div class="farm-connect"><div class="connect-row"><div class="field"><label for="farm-id">Enter Farm ID</label><input id="farm-id" type="number" min="1" inputmode="numeric" placeholder="Enter Farm ID" aria-describedby="farm-id-hint" /></div><button class="button secondary" type="button" data-action="connect-farm">Connect Farm</button></div><div id="farm-id-hint" class="field-hint" style="margin-top:8px">The field is shown for interface fidelity; no ID is saved or sent.</div><button class="demo-farm" type="button" data-action="load-demo">✦ Open a sample farm dashboard</button></div></section></main>';
    }
    return '<main class="page-shell">' + pageTitle('Farm Dashboard', 'A sample overview of production, inventory and active timers.', 'FARM OVERVIEW') +
      '<div class="demo-banner"><span>Sample farm preview — values are illustrative and are not synced to the game.</span><button class="button ghost" type="button" data-action="clear-demo">Close preview</button></div>' +
      '<section class="metrics-grid">' + metric('Ready to collect', '08', '✦', '4 crops · 2 animals · 2 daily tasks') + metric('Active timers', '12', '◷', 'Next completion in 00:18:42') + metric('Inventory items', '1,284', '▦', 'Sample snapshot') + metric('Projected daily value', '267.8', '✿', 'FLOWER · illustrative') + '</section>' +
      '<section class="two-column"><div class="card"><div class="card-heading"><div><h2>Upcoming timers</h2><p>Sample cycle status</p></div><span class="badge">SAMPLE DATA</span></div><div class="timer-list">' +
      timerRow('🌾', 'Wheat plots', '12 plots · 3 ready to harvest', '00:18:42') + timerRow('🥕', 'Carrots', '8 plots · growing', '02:41:09') + timerRow('🐔', 'Chicken coop', '6 chickens · next egg cycle', '05:12:33') + timerRow('🍯', 'Beehives', '4 hives · producing honey', '08:35:10') +
      '</div></div><div class="card"><div class="card-heading"><div><h2>Inventory snapshot</h2><p>Example balances</p></div><span class="badge neutral">DEMO</span></div><div class="table-wrap"><table><thead><tr><th>Resource</th><th>Amount</th></tr></thead><tbody>' +
      tableRow('🌻', 'FLOWER', '243.80') + tableRow('🪙', 'Coins', '18,420') + tableRow('🌾', 'Wheat', '96') + tableRow('🥚', 'Eggs', '24') + '</tbody></table></div></div></section></main>';
  }

  function timerRow(icon, name, detail, time) {
    return '<div class="timer-row"><span class="timer-emoji" aria-hidden="true">' + icon + '</span><span class="timer-info"><span class="timer-name">' + name + '</span><span class="timer-meta">' + detail + '</span></span><span class="timer-time">' + time + '</span></div>';
  }

  function tableRow(icon, name, value) {
    return '<tr><td><span class="table-item"><span class="table-emoji" aria-hidden="true">' + icon + '</span>' + name + '</span></td><td>' + value + '</td></tr>';
  }

  function numberField(id, label, value, suffix, min, step) {
    return '<div class="field"><label for="' + id + '">' + label + '</label><div class="input-wrap"><input id="' + id + '" type="number" min="' + (min === undefined ? '0' : min) + '" step="' + (step || 'any') + '" value="' + value + '" /><span class="input-suffix">' + (suffix || '') + '</span></div></div>';
  }

  function renderFarming() {
    const tabs = ['Crops Calculator', 'Fruit Calculator', 'Greenhouse Calculator', 'Crop Machine Calculator'];
    const tabHtml = tabs.map(function (tab) { return '<button type="button" class="segment' + (state.farmTab === tab ? ' active' : '') + '" data-farm-tab="' + tab + '">' + tab + '</button>'; }).join('');
    const options = Object.keys(cropExamples).map(function (name) { return '<option value="' + name + '">' + name + '</option>'; }).join('');
    return '<main class="page-shell">' + pageTitle('Farming Calculator', 'Estimate crop revenue and growing time from the assumptions you choose.', 'PRODUCTION') +
      '<div class="two-column"><div class="card"><div class="card-heading"><div><h2>Production inputs</h2><p>Values are editable examples, not live game data.</p></div></div><div class="segmented" role="tablist" aria-label="Farming calculator type">' + tabHtml + '</div>' +
      '<div class="form-grid" style="margin-top:19px"><div class="field"><label for="crop-name">Crop</label><select id="crop-name">' + options + '</select></div>' + numberField('crop-plots', 'Number of plots', 40, 'plots', 1, 1) + numberField('crop-yield', 'Yield per plot', 1, 'items', 0, 0.1) + numberField('crop-price', 'Sale value per item', 0.018, 'SFL', 0, 0.001) + numberField('crop-cost', 'Seed cost per plot', 0.006, 'SFL', 0, 0.001) + numberField('crop-hours', 'Cycle time', 0.5, 'hours', 0.1, 0.1) + '</div>' +
      '<label class="check-row" style="margin-top:15px"><input id="crop-boost" type="checkbox" /> Include a 10% illustrative yield boost</label>' +
      '<div class="notice"><span class="notice-icon">ⓘ</span><span>Market prices, event bonuses and skill effects change in the game. Use current values before relying on these estimates.</span></div></div>' +
      '<aside class="result-panel"><span class="result-label">Estimated net per harvest</span><div class="result-value" id="crop-net">0.00 SFL</div><span class="result-sub" id="crop-count">Across 40 plots</span><div class="result-divider"></div><div class="result-row"><span>Estimated per day</span><strong id="crop-daily" class="positive">0.00 SFL</strong></div><div class="result-row"><span>Estimated per week</span><strong id="crop-weekly" class="positive">0.00 SFL</strong></div><div class="result-row"><span>Cycle time</span><strong id="crop-cycle">0.5 hours</strong></div></aside></div>' +
      '<section class="card" style="margin-top:15px"><div class="card-heading"><div><h2>Selected items summary</h2><p>Combined projection for the current inputs</p></div><button type="button" class="button ghost" data-action="export-summary">Export JPG</button></div><div class="metrics-grid" style="margin-bottom:0">' + metric('Total combined PNL', '<span id="crop-total">0.00</span>', '✿', 'FLOWER · sample') + metric('Estimated daily', '<span id="crop-daily-card">0.00</span>', '◷', 'FLOWER') + metric('Average / season', '<span id="crop-season">0.00</span>', '🌱', 'FLOWER · 90 days') + metric('Selected plots', '<span id="crop-plot-card">40</span>', '▦', 'items per cycle') + '</div></section></main>';
  }

  function renderAnimals() {
    return '<main class="page-shell">' + pageTitle('Animal Calculator', 'Estimate feed cost, produce value and daily net from an example animal cycle.', 'PRODUCTION') +
      '<section class="metrics-grid">' + metric('Total feed cost', '<span id="animal-feed-top">0.00</span>', '🌾', 'SFL · per cycle') + metric('Produce value', '<span id="animal-revenue-top">0.00</span>', '🥚', 'SFL · per cycle') + metric('Combined PNL', '<span id="animal-net-top">0.00</span>', '✿', 'SFL · per cycle') + metric('Projection', '<span id="animal-daily-top">0.00</span>', '◷', 'SFL · per day') + '</section>' +
      '<div class="two-column"><div class="card"><div class="card-heading"><div><h2>Animal production</h2><p>Set the yield, price and cycle assumptions.</p></div><span class="badge neutral">SAMPLE</span></div><div class="form-grid">' +
      '<div class="field"><label for="animal-kind">Animal</label><select id="animal-kind"><option>Chicken</option><option>Cow</option><option>Sheep</option></select></div>' + numberField('animal-count', 'Animals', 10, 'units', 1, 1) + numberField('animal-yield', 'Produce per animal', 1, 'items', 0, 0.1) + numberField('animal-price', 'Value per item', 0.07, 'SFL', 0, 0.001) + numberField('animal-feed', 'Feed cost per animal', 0.02, 'SFL', 0, 0.001) + numberField('animal-hours', 'Cycle time', 24, 'hours', 0.1, 0.1) + '</div><div class="notice"><span class="notice-icon">ⓘ</span><span>Bonuses, feed consumption and timers vary by animal and farm. This preview uses the values entered above.</span></div></div>' +
      '<aside class="result-panel"><span class="result-label">Estimated net per cycle</span><div class="result-value" id="animal-net">0.00 SFL</div><span class="result-sub" id="animal-summary">10 chickens · 24 hour cycle</span><div class="result-divider"></div><div class="result-row"><span>Produce value</span><strong id="animal-revenue" class="positive">0.00 SFL</strong></div><div class="result-row"><span>Feed cost</span><strong id="animal-feed-cost">0.00 SFL</strong></div><div class="result-row"><span>Estimated per day</span><strong id="animal-daily" class="positive">0.00 SFL</strong></div></aside></div></main>';
  }

  function renderCooking() {
    const recipeOptions = Object.keys(recipeExamples).map(function (name) { return '<option value="' + name + '">' + name + '</option>'; }).join('');
    return '<main class="page-shell">' + pageTitle('Cooking Calculator', 'Compare recipe cost, sale value and experience across sample batches.', 'FOOD & XP') +
      '<div class="two-column"><div class="card"><div class="card-heading"><div><h2>Cooking options</h2><p>Choose a recipe and enter your own assumptions.</p></div><span class="badge gold">XP PLANNER</span></div><div class="form-grid"><div class="field"><label for="recipe-name">Recipe</label><select id="recipe-name">' + recipeOptions + '</select></div>' + numberField('recipe-batches', 'Number of batches', 10, 'batches', 1, 1) + numberField('recipe-cost', 'Ingredient cost per batch', 0.62, 'SFL', 0, 0.01) + numberField('recipe-price', 'Value per batch', 0.88, 'SFL', 0, 0.01) + numberField('recipe-xp', 'XP per batch', 34, 'XP', 0, 1) + numberField('recipe-hours', 'Cooking time per batch', 2, 'hours', 0.1, 0.1) + '</div>' +
      '<div class="notice"><span class="notice-icon">ⓘ</span><span>Boosts, cooking buildings, oil and recipe outputs are not synchronized. The example inputs are fully editable.</span></div></div><aside class="result-panel"><span class="result-label">Estimated batch profit</span><div class="result-value" id="recipe-profit">0.00 SFL</div><span class="result-sub">before any boosts or market fees</span><div class="result-divider"></div><div class="result-row"><span>Total ingredient cost</span><strong id="recipe-total-cost">0.00 SFL</strong></div><div class="result-row"><span>Total output value</span><strong id="recipe-total-value" class="positive">0.00 SFL</strong></div><div class="result-row"><span>Total experience</span><strong id="recipe-total-xp">0 XP</strong></div><div class="result-row"><span>Time for all batches</span><strong id="recipe-total-time">20 hours</strong></div></aside></div>' +
      '<section class="feature-section"><div class="section-heading"><div><span class="eyebrow">MORE FOOD TOOLS</span><h2>Food & XP suite</h2></div></div><div class="generic-grid">' + groups[1].tools.map(function (tool) { return '<a class="tool-tile" href="#/' + tool.key + '" data-route="' + tool.key + '"><div class="feature-icon">' + tool.icon + '</div><strong>' + tool.name + '</strong><span>' + tool.description + '</span></a>'; }).join('') + '</div></section></main>';
  }

  function renderCoinConverter() {
    return '<main class="page-shell">' + pageTitle('Coin Converter', 'Convert between SFL and Coins using an editable sample rate.', 'MARKET & CURRENCY') +
      '<section class="two-column equal"><div class="card"><div class="card-heading"><div><h2>Quick conversion</h2><p>Original site prices are cached. This preview is offline.</p></div><span class="badge neutral">SAMPLE RATE</span></div><div class="segmented" aria-label="Conversion direction"><button type="button" class="segment' + (state.converterDirection === 'sfl' ? ' active' : '') + '" data-direction="sfl">SFL → Coins</button><button type="button" class="segment' + (state.converterDirection === 'coins' ? ' active' : '') + '" data-direction="coins">Coins → SFL</button></div><div class="form-grid" style="margin-top:18px">' + numberField('convert-amount', 'Amount', 10, state.converterDirection === 'sfl' ? 'SFL' : 'Coins', 0, 0.01) + numberField('convert-rate', 'Coins per SFL', 1367.78, 'Coins', 0, 0.01) + '</div><div class="result-divider"></div><div class="result-label">Converted amount</div><div class="result-value" id="convert-result">13,677.80 Coins</div><span class="result-sub" id="convert-equation">10 SFL × 1,367.78 Coins</span><div class="notice"><span class="notice-icon">ⓘ</span><span>The reference value was observed during the REA capture and is not current market data. Edit the rate to recalculate.</span></div></div>' +
      '<div class="card"><div class="card-heading"><div><h2>Sample market rows</h2><p>Values visible in the captured public page.</p></div><span class="badge gold">REFERENCE ONLY</span></div><div class="table-wrap"><table><thead><tr><th>Item</th><th>P2P price</th><th>Coins / SFL</th></tr></thead><tbody>' +
      '<tr><td><span class="table-item"><span class="table-emoji">🍚</span>Rice Greenhouse</span></td><td>0.233956 SFL</td><td>1,367.78</td></tr><tr><td><span class="table-item"><span class="table-emoji">🍇</span>Celestine Fruit</span></td><td>0.149229 SFL</td><td>1,340.23</td></tr><tr><td><span class="table-item"><span class="table-emoji">🌻</span>FLOWER</span></td><td>Reference rate</td><td>1,367.78</td></tr>' +
      '</tbody></table></div><div class="notice"><span class="notice-icon">⌁</span><span>Original page controls include market refresh and Coin Swindler ranks. Those live features are not connected here.</span></div></div></section></main>';
  }

  function renderChapterRace() {
    return '<main class="page-shell">' + pageTitle('Chapter Race', 'Project a ticket total from current progress and your expected daily rewards.', 'PROGRESSION') +
      '<div class="two-column"><div class="card"><div class="card-heading"><div><h2>Race projection</h2><p>Enter the current total and the remaining schedule.</p></div><button class="button ghost" type="button" data-action="reset-race">Reset</button></div><div class="form-grid">' + numberField('race-current', 'Current tickets', 0, 'tickets', 0, 1) + numberField('race-days', 'Days remaining', 17, 'days', 0, 1) + numberField('race-daily', 'Expected tickets per day', 5, 'tickets', 0, 1) + numberField('race-bonus', 'Pending bonus tickets', 0, 'tickets', 0, 1) + '</div><div class="list-checks"><label class="check-row"><input type="checkbox" checked /> Daily ticket delivery</label><label class="check-row"><input type="checkbox" /> Weekly chores</label><label class="check-row"><input type="checkbox" /> Bounty board</label><label class="check-row"><input type="checkbox" /> Season rewards</label></div><div class="notice"><span class="notice-icon">ⓘ</span><span>The original tracker can fill the current count from a connected farm. This preview only uses the values you enter.</span></div></div>' +
      '<aside class="result-panel"><span class="result-label">Projected total</span><div class="result-value" id="race-total">85</div><span class="result-sub">tickets by the end of the selected period</span><div class="result-divider"></div><div class="result-row"><span>Current</span><strong id="race-current-out">0</strong></div><div class="result-row"><span>Expected daily</span><strong id="race-daily-out">85</strong></div><div class="result-row"><span>Pending bonus</span><strong id="race-bonus-out">0</strong></div><div class="result-row"><span>Days remaining</span><strong id="race-days-out">17 days</strong></div><div class="result-divider"></div><span class="badge">LOCAL PROJECTION</span></aside></div></main>';
  }

  const skillRows = [
    ['farming', '🌱', 'Farming', 'Crop yield and production bonuses'],
    ['cooking', '🍲', 'Cooking', 'Recipe and food experience bonuses'],
    ['animals', '🐔', 'Animals', 'Animal yield and cycle bonuses'],
    ['market', '🪙', 'Market', 'Coin and trade bonuses'],
    ['gathering', '🪨', 'Gathering', 'Resource collection bonuses']
  ];

  function renderSkills() {
    const rows = skillRows.map(function (row) {
      const rank = state.ranks[row[0]];
      return '<div class="skill-row"><div class="feature-icon" aria-hidden="true">' + row[1] + '</div><div class="skill-copy"><strong>' + row[2] + '</strong><span>' + row[3] + '</span></div><div class="rank-control"><button type="button" aria-label="Decrease ' + row[2] + ' rank" data-rank="' + row[0] + '" data-delta="-1">−</button><span class="rank-number">' + rank + '</span><button type="button" aria-label="Increase ' + row[2] + ' rank" data-rank="' + row[0] + '" data-delta="1">+</button></div></div>';
    }).join('');
    const totalRanks = Object.keys(state.ranks).reduce(function (sum, key) { return sum + state.ranks[key]; }, 0);
    const sampleCost = Object.keys(state.ranks).reduce(function (sum, key) { const rank = state.ranks[key]; return sum + (rank * (rank + 1)) / 2; }, 0);
    return '<main class="page-shell">' + pageTitle('Skill Simulator', 'Plan sample skill ranks and review an illustrative upgrade cost.', 'PROGRESSION') +
      '<div class="two-column"><div class="card"><div class="card-heading"><div><h2>Skill allocation</h2><p>Use the controls to change the sample ranks.</p></div><button type="button" class="button ghost" data-action="clear-skills">Clear all</button></div><div class="skill-list">' + rows + '</div><div class="notice"><span class="notice-icon">ⓘ</span><span>The source skill simulator includes game-specific tiers and unlock costs. This compact local model is illustrative.</span></div></div>' +
      '<aside class="result-panel"><span class="result-label">Illustrative upgrade cost</span><div class="result-value">' + sampleCost + ' <span style="font-size:16px">SP</span></div><span class="result-sub">sample skill points</span><div class="result-divider"></div><div class="result-row"><span>Allocated ranks</span><strong>' + totalRanks + '</strong></div><div class="result-row"><span>Skills selected</span><strong>' + Object.keys(state.ranks).filter(function (key) { return state.ranks[key] > 0; }).length + '</strong></div><div class="result-divider"></div><span class="badge neutral">NO FARM DATA REQUIRED</span></aside></div></main>';
  }

  function renderPRNG() {
    const modes = ['Crops', 'Fruit', 'Greenhouse', 'Aging Fish', 'Cooking', 'Crafting Box', 'Crustaceans', 'Processed Food', 'Fermentation', 'Crimstone', 'Gold', 'Iron', 'Salt', 'Stone', 'Tree'];
    const modeButtons = modes.map(function (mode) { return '<button type="button" class="segment' + (state.prngMode === mode ? ' active' : '') + '" data-prng-mode="' + mode + '">' + mode + '</button>'; }).join('');
    const results = state.prngValues.length ? '<div class="table-wrap" style="margin-top:15px"><table><thead><tr><th>Sample</th><th>Illustrative index</th><th>Outcome</th></tr></thead><tbody>' + state.prngValues.map(function (value, index) { return '<tr><td>' + (index + 1) + '</td><td>' + value.index + '</td><td>' + (value.critical ? 'Critical' : 'Regular') + '</td></tr>'; }).join('') + '</tbody></table></div>' : '<div class="placeholder-panel" style="margin:15px 0 0;padding:20px"><p>Choose a category, set a seed and generate a local sample sequence.</p></div>';
    return '<main class="page-shell">' + pageTitle('PRNG Simulator', 'Explore an illustrative sequence from a seed value.', 'TOOLS') +
      '<div class="card"><div class="card-heading"><div><h2>Simulator options</h2><p>Choose a sample category and seed.</p></div><span class="badge gold">ILLUSTRATIVE</span></div><div class="small muted" style="margin-bottom:8px">AGRICULTURE & FOOD</div><div class="segmented" role="group" aria-label="Simulator category">' + modeButtons + '</div><div class="form-grid three" style="margin-top:19px">' + numberField('prng-seed', 'Seed', 123456, 'value', 0, 1) + numberField('prng-count', 'Sample outcomes', 8, 'rolls', 1, 1) + '<div class="field"><label for="prng-threshold">Sample threshold</label><div class="input-wrap"><input id="prng-threshold" type="number" min="0" max="100" value="10" step="1" /><span class="input-suffix">%</span></div></div></div><button class="button primary" type="button" style="margin-top:17px" data-action="simulate-prng">Generate sample sequence <span aria-hidden="true">→</span></button>' + results + '<div class="notice"><span class="notice-icon">ⓘ</span><span>This reconstruction does not reproduce or predict Sunflower Land RNG. The generated sequence is a deterministic local illustration only.</span></div></div></main>';
  }

  function renderGuide() {
    const topics = Object.keys(guideCopy);
    const nav = topics.map(function (topic) { return '<button type="button" class="' + (state.guideTopic === topic ? 'active' : '') + '" data-guide-topic="' + topic + '">' + topic + '</button>'; }).join('');
    const paragraphs = guideCopy[state.guideTopic] || guideCopy['Quick Start'];
    return '<main class="page-shell">' + pageTitle('How to Use SFL Calculator', 'A guide to the calculator areas and the boundaries of this local preview.', 'BEGINNER & POWER USER MANUAL') +
      '<div class="guide-layout"><nav class="guide-nav" aria-label="Guide topics">' + nav + '</nav><section class="card"><span class="eyebrow">QUICK REFERENCE</span><h2 style="margin-top:10px">' + state.guideTopic + '</h2>' + paragraphs.map(function (paragraph, index) { return '<div class="guide-step"><span class="step-number">' + (index + 1) + '</span><div><h3>' + (index === 0 ? 'What to know' : 'Using this preview') + '</h3><p>' + paragraph + '</p></div></div>'; }).join('') + '<div class="notice"><span class="notice-icon">◈</span><span>REA observed the public pages and navigation. A connected farm, live market, notifications and wallet actions are outside this local implementation.</span></div></section></div></main>';
  }

  function renderCatalog() {
    return '<main class="page-shell">' + pageTitle('All calculators & tools', 'The public navigation exposed 35 routes across four categories.', 'TOOL DIRECTORY') + groups.map(function (group) {
      return '<section class="feature-section" style="margin-top:27px"><div class="section-heading"><div><span class="eyebrow">' + group.icon + ' ' + group.name.toUpperCase() + '</span><h2>' + group.name + '</h2></div><span class="badge neutral">' + group.tools.length + ' tools</span></div><div class="generic-grid">' + group.tools.map(function (tool) {
        return '<a class="tool-tile" href="#/' + tool.key + '" data-route="' + tool.key + '"><div class="feature-icon" aria-hidden="true">' + tool.icon + '</div><strong>' + escapeText(tool.name) + '</strong><span>' + escapeText(tool.description) + '</span></a>';
      }).join('') + '</div></section>';
    }).join('') + '</main>';
  }

  function renderMappedPreview(key) {
    const info = observedScreens[key];
    if (!info) return renderPlaceholder(key);
    const stats = (info.stats || []).map(function (item) { return metric(item[0], item[1], item[2], item[3]); }).join('');
    const fields = (info.fields || []).map(function (field) {
      const id = field[0];
      const label = field[1];
      const value = field[2];
      const suffix = field[3];
      if (suffix === 'name' || suffix === 'not stored') {
        return '<div class="field"><label for="' + id + '">' + label + '</label><input id="' + id + '" type="text" value="' + escapeText(value) + '" placeholder="' + (suffix === 'not stored' ? 'Not saved or transmitted' : 'Search') + '" /></div>';
      }
      return numberField(id, label, value, suffix, 0, 'any');
    }).join('');
    const chips = (info.buttons || []).map(function (label, index) {
      const selected = state.previewSelections[key] === label;
      return '<button class="segment' + (selected ? ' active' : '') + '" type="button" aria-pressed="' + selected + '" data-preview-chip="' + escapeText(label) + '" data-preview-route="' + key + '">' + escapeText(label) + '</button>';
    }).join('');
    const checks = (info.checks || []).map(function (label, index) {
      return '<label class="check-row"><input type="checkbox" ' + (index < 3 ? 'checked' : '') + ' />' + escapeText(label) + '</label>';
    }).join('');
    const rows = (info.rows || []).map(function (row) { return '<tr><td>' + escapeText(row[0]) + '</td><td>' + escapeText(row[1]) + '</td></tr>'; }).join('');
    const isEmpty = Boolean(info.empty);
    const emptyContent = isEmpty ? '<div class="empty-illustration" style="width:52px;height:52px;margin:15px 0 8px;font-size:22px" aria-hidden="true">⌂</div><p class="muted small" style="margin:0">' + escapeText(info.empty) + '</p>' : '';
    const selected = state.previewSelections[key] ? '<div class="result-row"><span>Selected control</span><strong>' + escapeText(state.previewSelections[key]) + '</strong></div>' : '';
    return '<main class="page-shell">' + pageTitle(escapeText(info.title), escapeText(info.description), info.group) +
      (stats ? '<section class="metrics-grid">' + stats + '</section>' : '') +
      '<div class="two-column"><section class="card"><div class="card-heading"><div><h2>' + escapeText(info.panel) + '</h2><p>' + (isEmpty ? 'No connected farm data' : 'Controls and labels observed in the public page') + '</p></div><span class="badge ' + (isEmpty ? 'neutral' : 'gold') + '">' + (isEmpty ? 'NO FARM DATA' : 'REFERENCE VIEW') + '</span></div>' +
      (fields ? '<div class="form-grid">' + fields + '</div>' : '') + (chips ? '<div class="segmented" role="group" aria-label="' + escapeText(info.panel) + ' controls" style="margin-top:' + (fields ? '15px' : '0') + '">' + chips + '</div>' : '') + (checks ? '<div class="list-checks">' + checks + '</div>' : '') + emptyContent +
      (rows ? '<div class="table-wrap" style="margin-top:16px"><table><thead><tr><th>Item</th><th>Reference</th></tr></thead><tbody>' + rows + '</tbody></table></div>' : '') +
      '<div class="notice"><span class="notice-icon">ⓘ</span><span>' + escapeText(info.note || 'This is a local interface reconstruction; live data is not connected.') + '</span></div></section>' +
      '<aside class="result-panel"><span class="result-label">Module state</span><div class="result-value" style="font-size:27px">' + (isEmpty ? 'No data' : 'Preview') + '</div><span class="result-sub">' + (isEmpty ? 'Connect Farm is unavailable in this clone' : 'Captured first-screen layout') + '</span><div class="result-divider"></div>' + (selected || '<div class="result-row"><span>Data connection</span><strong>Offline</strong></div>') + '<div class="result-row"><span>Farm ID storage</span><strong>Disabled</strong></div><div class="result-row"><span>External requests</span><strong>None</strong></div><div class="result-divider"></div>' + routeLink('catalog', 'Browse all 35 tools →', 'button secondary') + '</aside></div></main>';
  }

  function renderPlaceholder(key) {
    const tool = routeIndex[key];
    if (!tool) return renderCatalog();
    const relatedGroup = groups.find(function (group) { return group.name === tool.group; });
    const related = relatedGroup.tools.filter(function (entry) { return entry.key !== key; }).slice(0, 4);
    return '<main class="page-shell">' + pageTitle(escapeText(tool.name), escapeText(tool.description), escapeText(tool.group.toUpperCase())) +
      '<section class="placeholder-panel"><div class="empty-illustration" aria-hidden="true">' + tool.icon + '</div><span class="badge neutral">ROUTE OBSERVED · SCREEN NOT YET MAPPED</span><h2 style="margin-top:15px">Module preview</h2><p>The REA capture confirmed this tool in the public navigation. Its detailed page was not part of the captured route sample, so this reconstruction does not invent game-specific controls or formulas for it.</p><p style="margin-top:10px">Open a mapped calculator or return to the tool directory to continue exploring.</p><div class="hero-actions">' + routeLink('catalog', 'Browse all tools', 'button primary') + routeLink('dashboard', 'Open dashboard', 'button secondary') + '</div></section>' +
      '<section class="feature-section"><div class="section-heading"><div><span class="eyebrow">RELATED</span><h2>More in ' + escapeText(tool.group) + '</h2></div></div><div class="generic-grid">' + related.map(function (entry) { return '<a class="tool-tile" href="#/' + entry.key + '" data-route="' + entry.key + '"><div class="feature-icon">' + entry.icon + '</div><strong>' + escapeText(entry.name) + '</strong><span>' + escapeText(entry.description) + '</span></a>'; }).join('') + '</div></section></main>';
  }

  function renderModal() {
    if (!state.modal) return '';
    return '<div class="modal-backdrop" role="presentation" data-action="backdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="connect-title"><span class="badge gold">LOCAL RECONSTRUCTION</span><h2 id="connect-title">Farm sync is not connected</h2><p>This preview does not send Farm IDs or call Sunflower Land services. You can still open a sample dashboard with fictional inventory and timers.</p><div class="modal-actions"><button class="button secondary" type="button" data-action="close-modal">Close</button><button class="button primary" type="button" data-action="load-demo">Open sample dashboard</button></div></section></div>';
  }

  function renderPage(route) {
    if (route === 'home') return renderHome();
    if (route === 'dashboard') return renderDashboard();
    if (route === 'farming') return renderFarming();
    if (route === 'animals') return renderAnimals();
    if (route === 'cooking') return renderCooking();
    if (route === 'coin-converter') return renderCoinConverter();
    if (route === 'chapter-race') return renderChapterRace();
    if (route === 'skills') return renderSkills();
    if (route === 'prng-simulator') return renderPRNG();
    if (route === 'guide') return renderGuide();
    if (route === 'catalog') return renderCatalog();
    return observedScreens[route] ? renderMappedPreview(route) : renderPlaceholder(route);
  }

  function renderApp() {
    const route = currentRoute();
    app.innerHTML = renderHeader(route) + renderPage(route) + renderFooter() + renderModal() + (state.toast ? '<div class="toast" role="status">' + state.toast + '</div>' : '');
    updateCalculations();
  }

  function getNumber(id, fallback) {
    const element = document.getElementById(id);
    if (!element) return fallback;
    const value = Number(element.value);
    return Number.isFinite(value) ? value : fallback;
  }

  function putText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  }

  function fmt(value, decimals) {
    const places = decimals === undefined ? 2 : decimals;
    return Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: places, maximumFractionDigits: places });
  }

  function updateFarming() {
    const crop = document.getElementById('crop-name');
    if (!crop) return;
    const example = cropExamples[crop.value] || cropExamples.Wheat;
    const plots = getNumber('crop-plots', 0);
    const yieldPerPlot = getNumber('crop-yield', example.yield);
    const price = getNumber('crop-price', example.price);
    const seedCost = getNumber('crop-cost', example.cost);
    const hours = Math.max(0.1, getNumber('crop-hours', example.hours));
    const boosted = document.getElementById('crop-boost') && document.getElementById('crop-boost').checked ? 1.1 : 1;
    const cycleNet = plots * (yieldPerPlot * boosted * price - seedCost);
    const daily = cycleNet * 24 / hours;
    putText('crop-net', fmt(cycleNet) + ' SFL');
    putText('crop-count', 'Across ' + fmt(plots, 0) + ' plots');
    putText('crop-daily', fmt(daily) + ' SFL');
    putText('crop-weekly', fmt(daily * 7) + ' SFL');
    putText('crop-cycle', fmt(hours, 1) + ' hours');
    putText('crop-total', fmt(cycleNet));
    putText('crop-daily-card', fmt(daily));
    putText('crop-season', fmt(daily * 90));
    putText('crop-plot-card', fmt(plots, 0));
  }

  function updateAnimals() {
    if (!document.getElementById('animal-count')) return;
    const count = getNumber('animal-count', 0);
    const yieldCount = getNumber('animal-yield', 0);
    const price = getNumber('animal-price', 0);
    const feedCost = getNumber('animal-feed', 0);
    const hours = Math.max(0.1, getNumber('animal-hours', 24));
    const revenue = count * yieldCount * price;
    const feed = count * feedCost;
    const net = revenue - feed;
    const daily = net * 24 / hours;
    const animal = document.getElementById('animal-kind').value.toLowerCase();
    putText('animal-net', fmt(net) + ' SFL');
    putText('animal-summary', fmt(count, 0) + ' ' + animal + 's · ' + fmt(hours, 1) + ' hour cycle');
    putText('animal-revenue', fmt(revenue) + ' SFL');
    putText('animal-feed-cost', fmt(feed) + ' SFL');
    putText('animal-daily', fmt(daily) + ' SFL');
    putText('animal-feed-top', fmt(feed));
    putText('animal-revenue-top', fmt(revenue));
    putText('animal-net-top', fmt(net));
    putText('animal-daily-top', fmt(daily));
  }

  function updateCooking() {
    const recipe = document.getElementById('recipe-name');
    if (!recipe) return;
    const example = recipeExamples[recipe.value] || recipeExamples['Pumpkin Soup'];
    const batches = getNumber('recipe-batches', 0);
    const cost = getNumber('recipe-cost', example.cost);
    const price = getNumber('recipe-price', example.price);
    const xp = getNumber('recipe-xp', example.xp);
    const hours = getNumber('recipe-hours', 0);
    putText('recipe-profit', fmt((price - cost) * batches) + ' SFL');
    putText('recipe-total-cost', fmt(cost * batches) + ' SFL');
    putText('recipe-total-value', fmt(price * batches) + ' SFL');
    putText('recipe-total-xp', fmt(xp * batches, 0) + ' XP');
    putText('recipe-total-time', fmt(hours * batches, 1) + ' hours');
  }

  function updateConverter() {
    if (!document.getElementById('convert-amount')) return;
    const amount = getNumber('convert-amount', 0);
    const rate = getNumber('convert-rate', 1);
    const result = state.converterDirection === 'sfl' ? amount * rate : (rate > 0 ? amount / rate : 0);
    const outCurrency = state.converterDirection === 'sfl' ? 'Coins' : 'SFL';
    const inCurrency = state.converterDirection === 'sfl' ? 'SFL' : 'Coins';
    putText('convert-result', fmt(result) + ' ' + outCurrency);
    putText('convert-equation', fmt(amount) + ' ' + inCurrency + (state.converterDirection === 'sfl' ? ' × ' : ' ÷ ') + fmt(rate) + ' Coins per SFL');
  }

  function updateRace() {
    if (!document.getElementById('race-current')) return;
    const current = getNumber('race-current', 0);
    const days = getNumber('race-days', 0);
    const daily = getNumber('race-daily', 0);
    const bonus = getNumber('race-bonus', 0);
    putText('race-total', fmt(current + days * daily + bonus, 0));
    putText('race-current-out', fmt(current, 0));
    putText('race-daily-out', fmt(days * daily, 0));
    putText('race-bonus-out', fmt(bonus, 0));
    putText('race-days-out', fmt(days, 0) + ' days');
  }

  function updateCalculations() {
    updateFarming();
    updateAnimals();
    updateCooking();
    updateConverter();
    updateRace();
  }

  function showToast(message) {
    state.toast = message;
    renderApp();
    window.clearTimeout(state.toastTimer);
    state.toastTimer = window.setTimeout(function () { state.toast = ''; renderApp(); }, 3000);
  }

  function simulateSequence() {
    let seed = Math.max(1, getNumber('prng-seed', 1)) >>> 0;
    const count = Math.min(30, Math.max(1, getNumber('prng-count', 8)));
    const threshold = Math.min(100, Math.max(0, getNumber('prng-threshold', 10)));
    const values = [];
    for (let i = 0; i < count; i += 1) {
      seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
      const normalized = (seed >>> 0) / 4294967296;
      values.push({ index: Math.floor(normalized * 10000), critical: normalized * 100 < threshold });
    }
    state.prngValues = values;
    renderApp();
  }

  app.addEventListener('click', function (event) {
    const routeAnchor = event.target.closest('[data-route]');
    if (routeAnchor) {
      event.preventDefault();
      state.openMenu = null;
      state.mobileMenu = false;
      const key = routeAnchor.getAttribute('data-route');
      const hash = '#/' + key;
      if (window.location.hash === hash) renderApp(); else window.location.hash = hash;
      return;
    }
    const menuButton = event.target.closest('[data-menu]');
    if (menuButton) {
      const name = menuButton.getAttribute('data-menu');
      state.openMenu = state.openMenu === name ? null : name;
      renderApp();
      return;
    }
    const tabButton = event.target.closest('[data-farm-tab]');
    if (tabButton) {
      state.farmTab = tabButton.getAttribute('data-farm-tab');
      renderApp();
      return;
    }
    const directionButton = event.target.closest('[data-direction]');
    if (directionButton) {
      state.converterDirection = directionButton.getAttribute('data-direction');
      renderApp();
      return;
    }
    const modeButton = event.target.closest('[data-prng-mode]');
    if (modeButton) {
      state.prngMode = modeButton.getAttribute('data-prng-mode');
      state.prngValues = [];
      renderApp();
      return;
    }
    const guideButton = event.target.closest('[data-guide-topic]');
    if (guideButton) {
      state.guideTopic = guideButton.getAttribute('data-guide-topic');
      renderApp();
      return;
    }
    const previewChip = event.target.closest('[data-preview-chip]');
    if (previewChip) {
      const key = previewChip.getAttribute('data-preview-route');
      const label = previewChip.getAttribute('data-preview-chip');
      state.previewSelections[key] = state.previewSelections[key] === label ? null : label;
      renderApp();
      return;
    }
    const rankButton = event.target.closest('[data-rank]');
    if (rankButton) {
      const key = rankButton.getAttribute('data-rank');
      const delta = Number(rankButton.getAttribute('data-delta'));
      state.ranks[key] = Math.max(0, Math.min(3, state.ranks[key] + delta));
      renderApp();
      return;
    }
    const actionButton = event.target.closest('[data-action]');
    if (!actionButton) return;
    const action = actionButton.getAttribute('data-action');
    if (action === 'mobile-menu') { state.mobileMenu = !state.mobileMenu; state.openMenu = null; renderApp(); }
    else if (action === 'connect-farm') { state.modal = true; renderApp(); }
    else if (action === 'close-modal' || action === 'backdrop' && event.target === actionButton) { state.modal = false; renderApp(); }
    else if (action === 'load-demo') { state.demoFarm = true; state.modal = false; state.toast = ''; if (currentRoute() !== 'dashboard') window.location.hash = '#/dashboard'; else renderApp(); }
    else if (action === 'clear-demo') { state.demoFarm = false; renderApp(); }
    else if (action === 'clear-skills') { Object.keys(state.ranks).forEach(function (key) { state.ranks[key] = 0; }); renderApp(); }
    else if (action === 'reset-race') { renderApp(); }
    else if (action === 'simulate-prng') simulateSequence();
    else if (action === 'export-summary') showToast('Export is available in the source application; this local preview keeps the estimates on screen.');
  });

  app.addEventListener('input', updateCalculations);
  app.addEventListener('change', updateCalculations);
  document.addEventListener('click', function (event) {
    if (state.openMenu && !event.target.closest('.primary-nav')) { state.openMenu = null; renderApp(); }
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && (state.modal || state.openMenu || state.mobileMenu)) {
      state.modal = false; state.openMenu = null; state.mobileMenu = false; renderApp();
    }
  });
  window.addEventListener('hashchange', renderApp);
  renderApp();
})();
