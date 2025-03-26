const Watchlist = require('../models/watchlist');

exports.getWatchList = async (req, res) => {
    try {
        const watchlist = await Watchlist.findOne({ userID: req.user.id});
        if (!watchlist) {
        return res.status(404).json({ message: "No watchlist found" });
        }
        return res.json(watchlist);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.addToWatchList = async (req, res) => {
    try{
        const watchlist = await Watchlist.findOne({userID:req.user.id})
        
        if(!watchlist){
            res.status(404).json({message:"Users Watchlist Not Found"})
        }
        else{
            watchlist.items.push(req.body.itemID)
            await watchlist.save()
    
            res.status(200).json({message:"Successfully Watchlisted Item"});   
        }
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
};

exports.removeFromWatchList = async (req, res) => {
    try{
        const watchlist = await Watchlist.findOne({userID:req.user.id})
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
        else{
            watchlist.save()
            res.status(200).json({message:"Successfully Removed Item"});
        }
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
};

exports.createWatchList = async (req, res) => {
    try{
        const watchlist = await Watchlist.findOne({userID:req.user.id})

        if(watchlist){
            res.status(404).json({message:"User Already has a Watchlist"})
        }

        const newWatchlist = new Watchlist({
            userID:req.user.id
        })

        await newWatchlist.save();
        res.status(200).json(newWatchlist);
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
};
