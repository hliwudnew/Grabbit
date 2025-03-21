const Watchlist = require('../models/watchlist');

exports.getWatchList = async (req, res) => {
    try{
        const watchlist = await Watchlist.findOne({userID:req.user._id})

        if(!watchlist){
            res.status(404).json({message:"Users Watchlist Not Found"})
        }

        res.status(200).json(watchlist);
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
};

exports.addToWatchList = async (req, res) => {
    try{
        const watchlist = await Watchlist.findOne({userID:req.user._id})

        if(!watchlist){
            res.status(404).json({message:"Users Watchlist Not Found"})
        }

        watchlist.items.push(req.body.itemID)
        await watchlist.save()

        res.status(200).json({message:"Successfully Watchlisted Item"});
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
};

exports.removeFromWatchList = async (req, res) => {
    try{
        const watchlist = await Watchlist.findOne({userID:req.user._id})
        var found = false;

        if(!watchlist){
            res.status(404).json({message:"Users Watchlist Not Found"})
        }

        if(req.body.itemID !== null && req.body.itemID !== undefined && req.body.itemID !== ""){
            for(let i =0; i < watchlist.items.length; i++){
                if(watchlist.items[i] == req.body.itemID){
                    watchlist.items.splice(i,1)
                    found = true;
                    break;
                }
            }
        }

        if(!found){
            res.status(404).json({message:"Could not remove Item"})
        }
        
        watchlist.save()
        res.status(200).json({message:"Successfully Removed Item"});
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
};

exports.createWatchList = async (req, res) => {
    try{
        const watchlist = await Watchlist.findOne({userID:req.user._id})

        if(watchlist){
            res.status(404).json({message:"User Already has a Watchlist"})
        }

        const newWatchlist = new Watchlist({
            userID:req.user._id
        })

        await newWatchlist.save();
        res.status(200).json(newWatchlist);
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
};
