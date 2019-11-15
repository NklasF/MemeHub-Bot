const db = require('./mongo-db');
const util = require('./util.js');
const admins = require('./admins.js');

/**
 * Checks Message if its from Admin and if it contains Repost
 * @param {The telegraph message context} ctx 
 */
async function is_clearing_request(ctx) {
    if (ctx.update.message.text != '/repost') return false;
    if (ctx.update.message.reply_to_message == null) return false;
    if (!await admins.can_delete_messages(ctx.update.message.from)) return false;
    
    return true;
}
/**
 * Deletes Repost and Command Message
 * @param {The telegraph message context} ctx 
 */
async function clear_repost(ctx) {
    try {
        if (await is_clearing_request(ctx)) {
            var repost_msg_id = ctx.update.message.reply_to_message.message_id;
            var answer_msg_id = ctx.update.message.message_id;
            db.save_repost(repost_msg_id);
            ctx.deleteMessage(repost_msg_id);
            ctx.deleteMessage(answer_msg_id);
        }
    }
    catch (err) {
        util.log_error("Failed to clear repost message or repost command. The bot might need to have the 'can_delete_messages' privilege.", err);
    }
}


module.exports.clear_repost = clear_repost;
module.exports.is_clearing_request = is_clearing_request;