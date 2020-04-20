// imports
import express from 'express';

const router = express.Router();

router.route('/').get(
    async (req, res) => {
        try {
            res.status(200).json({
                status: 'success',
                code: 200,
                message: 'game server online',
            });
        }
        catch (err) {
            res.status(400).json(err);
        }
    });

export default router;
