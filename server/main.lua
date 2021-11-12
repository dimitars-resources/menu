ESX = nil

TriggerEvent('esx:getSharedObject', function(obj)
    ESX = obj
end)

Menu.RegisterEvent('menu:getItems', function(source)
    MySQL.Async.fetchAll("SELECT * FROM `items`", {}, function(items)
        TriggerClientEvent('menu:sendItems', source, items)
    end)
end)

Menu.RegisterEvent('menu:giveItem', function(source, item, amount)
    local _source = source
    local xPlayer = ESX.GetPlayerFromId(_source)

    if xPlayer.canCarryItem(item, amount) then
        xPlayer.addInventoryItem(item, amount)
        print('^5[Menu]^7 Successfully added x' .. amount .. ' item/s with name: `' .. item .. '` to ' .. xPlayer.name .. '!')
    end
end)

-- Credit to: chezza#1234
function CheckItem(name)
    local p = promise.new()
    MySQL.Async.fetchScalar("SELECT COUNT(1) FROM items WHERE name=@name", 
    {
        ["@name"] = name
    }, function (count)
        if count > 0 then 
            p:resolve(false)
        else 
            p:resolve(true)
        end
    end)
    return Citizen.Await(p)
end

Menu.RegisterEvent('menu:createItem', function(source, name, label, weight, limit)
    if CheckItem(name) then
        MySQL.Async.execute('INSERT INTO `items` (`name`, `label`, `weight`, `limit`) VALUES (@name, @label, @weight, @limit)', {
            ['@name'] = tostring(name),
            ['@label'] = tostring(label),
            ['@weight'] = tonumber(weight),
            ['@limit'] = tonumber(limit)
        }, function(itemAdded)
            print('^5[Menu]^7 Successfully created item with name: `' .. name .. '`!')
        end)
    else
        print('^5[Menu]^7 Item with name: `' .. name .. '` already exist!')
    end
end)