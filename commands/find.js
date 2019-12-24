// This command is to modify/edit guild configuration. Perm Level 3 for admins
// and owners only. Used for changing prefixes and role names and such.

// Note that there's no "checks" in this basic version - no config "types" like
// Role, String, Int, etc... It's basic, to be extended with your deft hands!

// Note the **destructuring** here. instead of `args` we have :
// [action, key, ...value]
// This gives us the equivalent of either:
// const action = args[0]; const key = args[1]; const value = args.slice(2);
// OR the same as:
// const [action, key, ...value] = args;
exports.run = async (client, message, [action, key, ...value], level) => { // eslint-disable-line no-unused-vars

    // Retrieve current guild settings (merged) and overrides only.
    const settings = message.settings;
    const defaults = client.settings.get("default");
    const overrides = client.settings.get(message.guild.id);
    
    const sagiri = require('sagiri');
    const discord = require("discord.js");

    const saucenaoToken = process.env.SAUCENAO_TOKEN;

    const clientapi = sagiri(saucenaoToken);

    if (!client.settings.has(message.guild.id)) client.settings.set(message.guild.id, {});

    var validUrl = require('valid-url');
    // No valid URL was entered
    if(action == null || !validUrl.isWebUri(action))
    {
      message.channel.send(`usage: "find <url>"`, {code:"asciidoc"});
    }
    else 
    {
      let output = new discord.RichEmbed()
      var results = await clientapi(action);

      // Check if there are any results
      if(results.length > 0)
      {
        let topResult = results[0];
        output.setColor('#0099ff')
          .setTitle(topResult.site)
          .setURL(topResult.url)
          .setThumbnail(topResult.thumbnail)
          .setDescription(`Similarity: ${topResult.similarity}%`);
        let message = '';
        // Check if there are more than one matches found
        if(results.length > 1)
        {
          // Get next up to 4 results found
          let len = results.length > 5 ? 5 : results.length;
          for (var i = 1; i < len; i++)
          {
            message += `${results[i].similarity}% : ${results[i].url}\n`
          }
        }
        if(message != '')
        {
          output.addField("Other results", message)
        }
      }
      // No results found
      else 
      {
        output.setColor('#eb3434')
        .setTitle(`No matches found`)
        .setDescription(topResult.url);
      }
      message.channel.send(output);
    }
  };
  
  exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["find"],
    permLevel: "User"
  };
  
  exports.help = {
    name: "find",
    category: "System",
    description: "Look up image",
    usage: "find <url>"
  };
  