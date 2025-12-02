
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateNewRoom = mutation({
    args:{
        coachingOption: v.string(),
        topic: v.string(),
        expertName: v.string(),
        userId: v.id('users')
    },
    handler: async(ctx,args)=>{
        const result = await ctx.db.insert('DiscussionRoom',{
            coachingOption: args.coachingOption,
            topic: args.topic,
            expertName: args.expertName,
            userId: args.userId
        });

        return result
    }
})

export const GetDiscussionRoom = query({
    args:{
        id:v.id('DiscussionRoom')
    },
    handler:async(ctx,args)=>{
        const result = await ctx.db.get(args.id);
        return result
    }
})

export const UpdateConversation = mutation({
    args: {
        id: v.id('DiscussionRoom'),
        conversation: v.any()
    },
    handler: async (ctx, args) => {
        const updatedRoom = await ctx.db.patch(args.id, {
            conversation: args.conversation
        });
        return updatedRoom;
    }
})
export const UpdateSummary = mutation({
    args: {
        id: v.id('DiscussionRoom'),
        summary: v.any()
    },
    handler: async (ctx, args) => {
        const updatedRoom = await ctx.db.patch(args.id, {
            summary: args.summary
        });
        return updatedRoom;
    }
})

export const GetAllDiscussionRoom = query({
    args:{
        userId:v.id('users')
    },
    handler:async(ctx,args)=>{
        const result = await ctx.db.query('DiscussionRoom')
        .filter(q=>q.eq(q.field('userId'), args.userId))
        .order('desc')
        .collect();
        return result
    }
})

export const DeleteDiscussionRoom = mutation({
    args: {
        id: v.id('DiscussionRoom')
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    }
})
