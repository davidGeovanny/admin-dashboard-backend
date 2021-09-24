const db = require('../db/connection');

const Profile = require('./profile');
const User    = require('./user');

const ProfileUser = db.define('ProfileUser', {}, {
  tableName : 'profile_user',
  timestamps: false,
});

User.belongsToMany( Profile, {
  through   : 'ProfileUser',
  foreignKey: 'id_user',
  as        : 'profiles'
});

Profile.belongsToMany( User, {
  through   : 'ProfileUser',
  foreignKey: 'id_profile',
  as        : 'users'
});

module.exports = ProfileUser;