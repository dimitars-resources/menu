ESX = nil

TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)

Menu.RegisterEvent('menu:getItems', function (source)
    MySQL.Async.fetchAll("SELECT * FROM `items`", {}, function(items)
        TriggerClientEvent('menu:sendItems', source, items)
    end)
end)

Menu.RegisterEvent('menu:giveItem', function (source, item, amount)
    local _source = source
    local xPlayer = ESX.GetPlayerFromId(_source)

    if xPlayer.canCarryItem(item, amount) then
        xPlayer.addInventoryItem(item, amount)
    end
end)