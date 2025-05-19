const token = process.env.token;
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const CHANNEL_IDS = ['your channel id']; //helper channels and showroom channels
const client = new Client({
  intents: [GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildMembers,]
});

client.once(Events.ClientReady, () => {
  console.log('Ready!');
});


client.on(Events.MessageCreate, async (interaction) => {
  //debug//console.log('message empfangen');
  //generate button for messages in specific channels which are not from bot
  if (CHANNEL_IDS.includes(interaction.channel.id) && !interaction.author.bot) {

    const commentButton = new ButtonBuilder()
      .setCustomId('comment_button')
      .setLabel('Komentieren')
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder()
      .addComponents(commentButton);

    //const response = await interaction.reply({
    //content: [""],
    const response = await interaction.channel.send({
      components: [row],
    });

    const confirmation = await response.awaitMessageComponent({});

    if (confirmation.customId === 'comment_button') {
      //console.log('comment button clicked');


      // button gedrückt

      const thread = await interaction.startThread({
        name: `Thread for ${interaction.author.username}`,
        autoArchiveDuration: 1440,
        //reason: 'Needed a separate thread for food',
      });

      await confirmation.update({
        content: `${client.user.tag} created a thread : https://discord.com/channels/${interaction.channelId}/${interaction.thread.id}`, components: []
      });
    }
    //debug //console.log('message empfangen im guten channel');
  }
});

client.login(token);