const db = require('../db/Connection_t');

const Profile = require('./Profile_t');
const User    = require('./User_t');

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