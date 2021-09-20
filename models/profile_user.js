const db = require('../db/connection');
const User = require('./user');
const Profile = require('./profile');

const Profile_User = db.define('Profile_User', {

}, {
  timestamps: false,
  tableName: 'profile_user',
  underscored: true,
});



// Profile.belongsToMany( User, {
//   through: Profile_User,
//   foreignKey: 'id_profile',
// });

module.exports = Profile_User;