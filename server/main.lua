Menu.RegisterEvent('menu:isAdmin', function(source)
    local _source = source
    local xPlayer = ESX.GetPlayerFromId(_source)

	return (xPlayer.getGroup() == Config.RequiredGroup)
end)

Menu.RegisterEvent('menu:getItems', function(source)
    MySQL.Async.fetchAll("SELECT * FROM `items`", {}, function(items)
        TriggerClientEvent('menu:sendItems', source, items)
    end)
end)

Menu.RegisterEvent('menu:giveItem', function(source, item, amount)
    local _source = source
    local xPlayer = ESX.GetPlayerFromId(_source)

    if xPlayer.canCarryItem(item, tonumber(amount)) then
        xPlayer.addInventoryItem(item, tonumber(amount))
        print('^5[Menu]^7 Successfully added x' .. tonumber(amount) .. ' item/s with name: `' .. item .. '` to ' .. xPlayer.getName() .. '!')
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

Menu.RegisterEvent('menu:createItem', function(source, name, label, weight, limit, isLimit, isWeight)
    if CheckItem(name) then
        if isLimit and not isWeight then
            MySQL.Async.execute('INSERT INTO `items` (`name`, `label`, `limit`) VALUES (@name, @label, @limit)', {
                ['@name'] = tostring(name),
                ['@label'] = tostring(label),
                ['@limit'] = tonumber(limit)
            }, function(itemAdded)
                print('^5[Menu]^7 Successfully created item with name: `' .. name .. '`!')
            end)
        elseif not isLimit and isWeight then
            MySQL.Async.execute('INSERT INTO `items` (`name`, `label`, `weight`) VALUES (@name, @label, @weight)', {
                ['@name'] = tostring(name),
                ['@label'] = tostring(label),
                ['@weight'] = tonumber(weight)
            }, function(itemAdded)
                print('^5[Menu]^7 Successfully created item with name: `' .. name .. '`!')
            end)
        else
            MySQL.Async.execute('INSERT INTO `items` (`name`, `label`, `weight`, `limit`) VALUES (@name, @label, @weight, @limit)', {
                ['@name'] = tostring(name),
                ['@label'] = tostring(label),
                ['@weight'] = tonumber(weight),
                ['@limit'] = tonumber(limit)
            }, function(itemAdded)
                print('^5[Menu]^7 Successfully created item with name: `' .. name .. '`!')
            end)
        end

        Wait(2000)
        TriggerEvent("esx:refreshItems")
    else
        print('^5[Menu]^7 Item with name: `' .. name .. '` already exist!')
    end
end)

Menu.RegisterEvent('menu:editItem', function(source, prevName, name, label, weight, limit, isLimit, isWeight)
    if isLimit and not isWeight then
        MySQL.Async.execute("UPDATE `items` SET name=@name, label=@label, limit=@limit WHERE name=@prevName", {
            ["@prevName"] = tostring(prevName),
            ['@name'] = tostring(name),
            ['@label'] = tostring(label),
            ['@limit'] = tonumber(limit)
        }, function(itemEdited)
            print('^5[Menu]^7 Successfully edited item with name: `' .. name .. '` (' .. prevName .. ')!')
        end)
    elseif not isLimit and isWeight then
        MySQL.Async.execute("UPDATE `items` SET name=@name, label=@label, weight=@weight WHERE name=@prevName", {
            ["@prevName"] = tostring(prevName),
            ['@name'] = tostring(name),
            ['@label'] = tostring(label),
            ['@weight'] = tonumber(weight)
        }, function(itemEdited)
            print('^5[Menu]^7 Successfully edited item with name: `' .. name .. '` (' .. prevName .. ')!')
        end)
    else
        MySQL.Async.execute("UPDATE `items` SET name=@name, label=@label, weight=@weight, limit=@limit WHERE name=@prevName", {
            ["@prevName"] = tostring(prevName),
            ['@name'] = tostring(name),
            ['@label'] = tostring(label),
            ['@weight'] = tonumber(weight),
            ['@limit'] = tonumber(limit)
        }, function(itemEdited)
            print('^5[Menu]^7 Successfully edited item with name: `' .. name .. '` (' .. prevName .. ')!')
        end)
    end

    Wait(2000)
    TriggerEvent("esx:refreshItems")
end)

Menu.RegisterEvent('menu:deleteItem', function(source, name)
    MySQL.Async.execute('DELETE FROM `items` WHERE name=@name', {
		['@name'] = tostring(name)
	}, function(itemDeleted)
        print('^5[Menu]^7 Successfully deleted item with name: `' .. name .. '`!')
    end)

    Wait(2000)
    TriggerEvent("esx:refreshItems")
end)

Menu.RegisterEvent('menu:clearInventory', function(source)
    local _source = source
    local xPlayer = ESX.GetPlayerFromId(_source)

    for i=1, #xPlayer.inventory, 1 do
		if xPlayer.inventory[i].count > 0 then
			xPlayer.setInventoryItem(xPlayer.inventory[i].name, 0)
		end
	end
end)