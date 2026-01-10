import mongoose from 'mongoose';

const settingSchema = mongoose.Schema({
    btcAddress: { type: String, default: '' },
    ltcAddress: { type: String, default: '' },
    usdtAddress: { type: String, default: '' },
    ethAddress: { type: String, default: '' },
    solAddress: { type: String, default: '' },
    trxAddress: { type: String, default: '' },
    xrpAddress: { type: String, default: '' },
    xmrAddress: { type: String, default: '' },
    dogeAddress: { type: String, default: '' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true,
});

const Setting = mongoose.model('Setting', settingSchema);

export default Setting;
