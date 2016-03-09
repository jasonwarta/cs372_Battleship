// PlayersList = new Mongo.Collection('players'); 
BoardData = new Mongo.Collection('board');
PlayerAction = new Mongo.Collection('actions');
// {
//   _id: alphanumeric string
//   row: num, 0-9
//   col: num, 0-9
//   action: string, "ship","shot"
//	 rotation: "vertical","horizontal" //only for ships
//   shipLength: 2-5 	//only for ships
//   userId: alphanumeric string
// }

FriendlyCellArray = new Mongo.Collection('friendlyCells');
EnemyCellArray = new Mongo.Collection('enemyCells')
// {
//   _id: alphanumeric string
//   row: num, 0-9
//   col: num, 0-9
//   state: string, "empty","ship"
// }