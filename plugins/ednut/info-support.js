module.exports = [
  {
    command: ["owner"],
    description: "Get owner contact",
    category: "Info",
    ban: true,
    gcban: true,
    execute: async (m, { ednut }) => {
      await ednut.sendContact(m.chat, [global.owner], `${global.ownername}`)
    }
  },
  // ... rest of the code
  {
  command: ["repo"],
  alias: ["repository"],
  description: "Get repository information",
  category: "Info",
  ban: true,
  gcban: true,
  execute: async (m, { axios, reply4 }) => {
    try {
      const response = await axios.get(`https://api.github.com/repos/TristanCage/Arch-md`);
      if (response.status === 200) {
        const repoData = response.data;
        const formattedInfo = `*Repository Name:* ${repoData.name}
*Description:* ${repoData.description}
*Owner:* ${repoData.owner.login}
*Stars:* ${repoData.stargazers_count}
*Forks:* ${repoData.forks_count}
*Session:* ${global.scan}

*URL:* ${repoData.html_url}`;
        reply4(formattedInfo);
      } else {
        await m.reply(`Unable to fetch repository information`);
      }
    } catch (error) {
      log("ERROR", `Failed to fetch GitHub repo: ${error.message || error}`);
      await m.reply(`Repository currently not available`);
    }
  }
}
]