/***************************************
 * Channel List
****************************************/
Template.channelList.helpers({
  channels: function() {
    return Channels.find();
  }
});

/***************************************
 * Channel Item
****************************************/
Template.channelItem.helpers({
  totalUnread: function() {
    // console.log(this._id);
    return Messages.find({
      channel: this._id,
      recipient: Meteor.userId(),
      read: false
    }).count();
  },
  active: function() {
    if(this._id === Session.get('currentChannel')){
      return "active";
    }
  }
});

Template.channelItem.events({
  'click .select-channel': function() {
    $('.message-list').scrollTop($(document).height());

    Session.set('currentChannel', this._id);
    Session.set('currentChannelName', this.name);
    Session.set('currentChannelUrl', this.url);
    Session.set('currentChannelImage', this.image);
    Session.set('currentChannelCreator', this.creator);
    Session.set('currentChannelCreatorName', this.creatorName);
    Session.set('selectBuyer', null);
    Session.set('selectBuyerName', null);

    if(Router.current().params.query.id){
        Router.go('channelIndex');
    }
  }
});
/***************************************
 * Channel Card
****************************************/
Template.channelCard.helpers({
  channelLink: function() {
    var channel = Session.get('currentChannel');
    var domain = Meteor.absoluteUrl();
    return (domain+"channels?id="+channel);
  },
  isOwner:function() {
    var channelOwner = Session.get('currentChannelCreator');
    if( channelOwner === Meteor.userId()){
      return true;
    }
    return false;
  }
});

Template.channelCard.events({
  'click .card-link': function(event) {
    event.preventDefault();
    var link = $(event.target).attr("href");
    window.open(link, '_blank');
  },
  'click #delete-channel': function(event) {
    event.preventDefault();
    var channel = Session.get('currentChannel');
    if (confirm("Are you sure you want to delete? " + Session.get('currentChannelName') + ". (This can't be reversed!)")) {
      Session.set('currentChannel', null);
      Session.set('currentChannelName', null);
      Session.set('currentChannelUrl', null);
      Session.set('currentChannelImage', null);
      Session.set('currentChannelCreator', null);
      Session.set('currentChannelCreatorName', null);
      Session.set('selectBuyer', null);
      Session.set('selectBuyerName', null);
      Meteor.call('deleteChannel', channel);
    }
  },
  'click #leave-channel': function(event) {
    event.preventDefault();
    var currentChannel = Session.get('currentChannel');
    var buyer = Meteor.userId();
    Meteor.call('deleteBuyer', currentChannel, buyer, function(err, data) {
      if(err){
        alert(err.reason);
      }else{
        document.location.reload(true);
      }
    });
  }
});
