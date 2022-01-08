const db = require('../db/Connection');

const Profile = require('./Profile');
const User    = require('./User');

const ProfileUser = db.define('ProfileUser', {}, {
  tableName : 'profile_user',
  timestamps: false,
});

User.belongsToMany( Profile, {
  through   : 'ProfileUser',
  foreignKey: 'id_user',
  as        : 'profiles',
});

Profile.belongsToMany( User, {
  through   : 'ProfileUser',
  foreignKey: 'id_profile',
  as        : 'users'
});

module.exports = ProfileUser;